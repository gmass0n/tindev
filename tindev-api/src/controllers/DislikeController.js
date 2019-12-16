const Dev = require('../models/Dev');

module.exports = {
  async store(req, res) {
    const { devId } = req.params;
    const { user } = req.headers;

    const loggedDev = await Dev.findById(user);
    const targetDev = await Dev.findById(devId);

    // VERIFY TARGET DEV EXISTS IN DATABASE
    if(!targetDev) {
      return res.status(400).json({error: 'Dev not exists'});
    }

    // PUSH AND SAVE TARGET DEV ID IN LOGGED DEV LIKES FIELD
    loggedDev.dislikes.push(targetDev._id);

    // await loggedDev.save();

    return res.json(loggedDev);
  }
}