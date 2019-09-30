exports.sendStatus = (req, res) => {
    res.status(200).json({ status: 'OK' });
};
