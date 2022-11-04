import { FastifyInstance } from "fastify";
import { prisma } from "../lib/prisma";

import { z } from "zod";
import ShortUniqueId from "short-unique-id";
import { authenticate } from "../plugins/authenticate";

export async function poolRoutes(fastify: FastifyInstance) {
  fastify.get("/pools/count", async () => {
    const count = await prisma.pool.count();
    return { count };
  });

  fastify.post("/pools", async (req) => {
    const createPoolBody = z.object({
      title: z.string(),
    });

    const { title } = createPoolBody.parse(req.body);

    const generate = new ShortUniqueId({ length: 6 });
    const code = String(generate()).toUpperCase();

    try {
      await req.jwtVerify();

      await prisma.pool.create({
        data: {
          title,
          code,
          ownerId: req.user.sub,

          participants: {
            create: {
              userId: req.user.sub,
            },
          },
        },
      });
    } catch (err) {
      await prisma.pool.create({
        data: {
          title,
          code,
        },
      });
    }
  });

  fastify.post(
    "pools/:id/join",
    {
      onRequest: [authenticate],
    },
    async (req, rep) => {
      const joinPoolBody = z.object({
        code: z.string(),
      });

      const { code } = joinPoolBody.parse(req.body);

      const pool = await prisma.pool.findUnique({
        where: {
          code,
        },
        include: {
          participants: {
            where: {
              userId: req.user.sub,
            },
          },
        },
      });

      if (!pool) {
        return rep.status(400).send({
          message: "Pool not found!",
        });
      }

      if (pool.participants.length > 0) {
        return rep.status(400).send({
          message: 'You already joined this pool!'
        })
      }

      if (!pool.ownerId) {
        await prisma.pool.update({
          where: {
            id: pool.id
          },
          data: {
            ownerId: req.user.sub
          }
        })
      }

      await prisma.participant.create({
        data: {
          poolId: pool.id,
          userId: req.user.sub
        }
      });

      return rep.status(201).send()
    }
  );
}
