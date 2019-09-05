import Notification from '../schemas/NotificationSchema';
import User from '../models/User';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider can load notifications' });
    }

    const notifications = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: 'desc' })
      .limit(20);
    return res.json(notifications);
  }

  async update(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });
    // console.log('oi');

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only provider read notifications' });
    }
    const { id: notificationId } = req.params;

    const isNotRead = await Notification.find({
      _id: notificationId,
      user: req.userId,
      read: false,
    });

    if (isNotRead.length === 0) {
      return res.status(401).json({ error: 'Can not find notification!' });
    }

    const readNotification = await Notification.findByIdAndUpdate(
      notificationId,
      { read: true },
      { new: true }
    );

    return res.json(readNotification);
  }
}

export default new NotificationController();
