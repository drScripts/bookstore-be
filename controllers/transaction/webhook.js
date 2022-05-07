const { request, response } = require("express");
const { Snap } = require("midtrans-client");
const { midtransServerKey, midtransIsProduction } = require("../../config");
const { Transaction, TransactionLog } = require("../../models");
const { emailInvoiceHtml, sendMail } = require("../../helpers");
const moment = require("moment");

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

    snap.transaction.notification(req.body).then(async (statusResponse) => {
      let transactionId = statusResponse.order_id.split("-")[0];

      let transactionStatus = statusResponse.transaction_status;
      let fraudStatus = statusResponse.fraud_status;

      const transaction = await Transaction.findByPk(transactionId, {
        include: "user",
      });
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
          status = "approve";
          await sendMail(bodyEmail, transaction?.user?.email);
        }
      } else if (transactionStatus == "settlement") {
        status = "approve";
        await sendMail(bodyEmail, transaction?.user?.email);
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

      res.sendStatus(200);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
