import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const housingCloudRouter = createTRPCRouter({
  getAllHouseUnits: publicProcedure.query(async ({ ctx }) => {
    const houseUnits = await ctx.prisma.houseUnit.findMany({
      include: {
        coordinate: true,
        address: true,
      },
    });

    return {
      houseUnits,
    };
  }),

  getAllCampus: publicProcedure.query(async ({ ctx }) => {
    const campus = await ctx.prisma.campus.findMany({
      include: {
        coordinate: true,
        address: true,
      },
    });

    return {
      campus,
    };
  }),

  getAllUserInterests: publicProcedure
    .input(z.string())
    .query(async ({ ctx, input }) => {
      const interests = await ctx.prisma.interest.findMany({
        where: {
          email: input,
        },
      });

      return {
        interests: interests.map((interest) => {
          return interest.houseUnitId;
        }),
      };
    }),

  createHouseUnit: publicProcedure
    .input(
      z.object({
        city: z.string(),
        country: z.string(),
        number: z.string(),
        state: z.string(),
        street: z.string(),
        zip: z.string(),
        name: z.string(),
        price: z.number(),
        description: z.string(),
        bedrooms: z.number(),
        coordinate: z.object({
          x: z.number(),
          y: z.number(),
        })
      })
    )
    .mutation(async ({ ctx, input }) => {
      const address = await ctx.prisma.address.create({
        data: {
          city: input.city,
          country: input.country,
          number: input.number,
          state: input.state,
          street: input.street,
          zip: input.zip
        },
      });

      const coordinate = await ctx.prisma.coordinate.create({
        data: {
          x: input.coordinate.x,
          y: input.coordinate.y,
        },
      });

      await ctx.prisma.houseUnit.create({
        data: {
          name: input.name,
          price: input.price,
          bedrooms: input.bedrooms,
          description: input.description,
          addressId: address.id,
          coordinateId: coordinate.id,
        },
      });
    }),

  createCampus: publicProcedure.input(
    z.object({
      city: z.string(),
      country: z.string(),
      number: z.string(),
      state: z.string(),
      street: z.string(),
      zip: z.string(),
      name: z.string(),
      coordinate: z.object({
        x: z.number(),
        y: z.number(),
      })
    })
  ).mutation(async ({ ctx, input }) => {
    const address = await ctx.prisma.address.create({
      data: {
        city: input.city,
        country: input.country,
        number: input.number,
        state: input.state,
        street: input.street,
        zip: input.zip
      },
    });

    const coordinate = await ctx.prisma.coordinate.create({
      data: {
        x: input.coordinate.x,
        y: input.coordinate.y,
      },
    });

    await ctx.prisma.campus.create({
      data: {
        name: input.name,
        addressId: address.id,
        coordinateId: coordinate.id,
      },
    });
  }),

  createInterest: publicProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        houseUnitId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.interest.create({
        data: {
          name: input.name,
          email: input.email,
          houseUnitId: input.houseUnitId,
        },
      });
    }),

    deleteHouseUnit: publicProcedure.input(z.string()).mutation(async ({ctx, input}) => {
      await ctx.prisma.houseUnit.delete({
        where: {
          id: input
        }
      });
    }),

    deleteCampus: publicProcedure.input(z.string()).mutation(async ({ctx, input}) => {
      await ctx.prisma.campus.delete({
        where: {
          id: input
        }
      });
    })
});
