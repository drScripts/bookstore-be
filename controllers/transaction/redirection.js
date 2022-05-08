const { request, response } = require("express");
const { Snap } = require("midtrans-client");
const {
  midtransServerKey,
  midtransIsProduction,
  clientBaseUrl,
} = require("../../config");
const { Transaction, TransactionLog } = require("../../models");
const moment = require("moment");
const { sendMail, emailInvoiceHtml } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const snap = new Snap({
      serverKey: midtransServerKey,
      isProduction: midtransIsProduction,
    });

    const bodyResponse = JSON.parse(req.body.response);

    snap.transaction.notification(bodyResponse).then(async (statusResponse) => {
      let transactionId = statusResponse.order_id.split("-")[0];

      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;

      const transaction = await Transaction.findByPk(transactionId);
      if (!transaction) return res.send({ status: "OK" });
      const date = moment().format("DD, MMMM YYYY H:m:s");
      const bodyEmail = emailInvoiceHtml(
        date,
        transaction?.total,
        transaction?.user?.name,
        date,
        statusResponse?.order_id,
        transaction?.rawBody
      );

      let status = "pending";

      if (transactionStatus == "capture") {
        if (fraudStatus == "challenge") {
        } else if (fraudStatus == "accept") {
          await sendMail(bodyEmail, transaction?.user?.email);
          status = "approve";
        }
      } else if (transactionStatus == "settlement") {
        await sendMail(bodyEmail, transaction?.user?.email);
        status = "approve";
      } else if (transactionStatus == "deny") {
        status = "cancel";
      } else if (
        transactionStatus == "cancel" ||
        transactionStatus == "expire"
      ) {
        // TODO set transaction status on your databaase to 'failure'
        status = "cancel";
      } else if (transactionStatus == "pending") {
        // TODO set transaction status on your databaase to 'pending' / waiting payment
        status = "pending";
      }

      await transaction.update({
        status,
        paymentType: statusResponse.payment_type,
      });

      await TransactionLog.create({
        idTransaction: transactionId,
        status,
        rawBody: req.body,
      });

      res.redirect(clientBaseUrl + "/transaction/" + transactionId);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
