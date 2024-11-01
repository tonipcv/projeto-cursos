import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, description, videoId, embedUrl, videoType, thumbnail, duration, order, moduleId } = req.body;
    const newLesson = await prisma.lesson.create({
      data: { title, description, videoId, embedUrl, videoType, thumbnail, duration, order, moduleId },
    });
    res.status(201).json(newLesson);
  } else {
    res.status(405).end();
  }
}
