import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '../lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const courses = await prisma.course.findMany();
    res.status(200).json(courses);
  } else if (req.method === 'POST') {
    const { title, description, thumbnail } = req.body;
    const newCourse = await prisma.course.create({
      data: { title, description, thumbnail },
    });
    res.status(201).json(newCourse);
  } else {
    res.status(405).end();
  }
}
