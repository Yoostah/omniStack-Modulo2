import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';
import Appointment from '../models/Appointment';
import User from '../models/User';
import File from '../models/File';

class ScheduleController {
  async index(req, res) {
    const checkUserIsProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserIsProvider) {
      return res.status(401).json({ erros: 'User is not a provider' });
    }

    const { date } = req.query;

    const data = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(data), endOfDay(data)],
        },
      },
      attributes: ['id', 'date'],
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['id', 'path', 'url'],
            },
          ],
        },
      ],
      order: ['date'],
    });
    return res.json(appointments);
  }
}

export default new ScheduleController();
