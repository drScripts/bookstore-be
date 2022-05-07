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
    const { id } = req.params;

    const rawTransaction = await Transaction.findByPk(id, {
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

    const items = rawTransaction?.transactionItems?.map((item) => {
      item.book.thumbnail = getFileUrl(item?.book?.thumbnail, "image");

      if (rawTransaction?.status === "approve") {
        item.book.bookAttachment = getFileUrl(
          item?.book?.bookAttachment,
          "pdf"
        );
      }
      return item;
    });

    rawTransaction.transactionItems = items;

    rawTransaction.dataValues.shippingPrice =
      rawTransaction?.rawBody?.item_details?.pop()?.price || 0;

    res.status(200).json({
      status: "success",
      data: { transaction: rawTransaction },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ status: "error", message: "Internal server error" });
  }
};
