import type { Context } from '.keystone/types';

export async function seedDemoData(context: Context) {
  if ((await context.db.User.count()) > 0) return;

  for (const user of [
    {
      name: 'Borg',
      email:'borg@elevated.to',
      password:'R0ckTheCashBar'
    },
  ] as const) {
    await context.db.User.createOne({ data: user });
  }
}