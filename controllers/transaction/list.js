const { request, response } = require("express");
const { Transaction, TransactionItem, Book } = require("../../models");
const { getFileUrl } = require("../../helpers");

/**
 *
 * @param {request} req
 * @param {response} res
 *
 */
module.exports = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const rawTransactions = await Transaction.findAll({
      include: [
        {
          as: "transactionItems",
          model: TransactionItem,
          include: {
            as: "book",
            model: Book,
          },
        },
      ],
      where: { userId },
      order: [["createdAt", "DESC"]],
    });

    const transactions = await rawTransactions.map((transaction) => {
      const transactionItems = transaction?.transactionItems?.map((item) => {
        item.book.thumbnail = getFileUrl(item?.book?.thumbnail, "image");

        if (transaction?.status === "approve") {
          item.book.bookAttachment = getFileUrl(
            item?.book?.bookAttachment,
            "pdf"
          );
        } else {
          item.book.bookAttachment = null;
        }

        return item;
      });

      transaction.transactionItems = transactionItems;
      return transaction;
    });

    res.status(200).json({
      status: "success",
      data: { transactions },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
