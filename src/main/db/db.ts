import { app } from 'electron';
import { join } from 'path';
import { injectable } from 'inversify';
import type { Knex } from 'knex';

const knex = require('knex');

@injectable()
export class LocalDB {
  declare db: Knex;
  async init() {
    const sqliteDbPath = join(app.getPath('userData'), 'local.db');
    // const sqliteDbPath = './DB.db';
    console.log('sqliteDbPath:', sqliteDbPath);

    this.db = knex({
      client: 'sqlite3',
      useNullAsDefault: true,
      connection: {
        filename: sqliteDbPath,
      },
    });
    await this.sync();
  }

  async sync() {
    // notebooks
    await this.db.schema.hasTable('notebooks').then((exist) => {
      if (exist) return;
      return this.db.schema.createTable('notebooks', (table) => {
        table.bigIncrements('id', { primaryKey: true });

        table.string('name');
        table.timestamps(true, true);
      });
    });
    // notes
    await this.db.schema.hasTable('notes').then((exist) => {
      if (exist) return;
      return this.db.schema.createTable('notes', (table) => {
        table.bigIncrements('id', { primaryKey: true });
        table.string('name');
        table.text('content');
        table.bigInteger('notebook_id');
        table.timestamps(true, true);
      });
    });
    // media
    await this.db.schema.hasTable('media').then((exist) => {
      if (exist) return;
      return this.db.schema.createTable('media', (table) => {
        table.bigIncrements('id', { primaryKey: true });
        table.string('name');
        table.string('local_path');
        table.string('sandbox_path');
        table.bigInteger('note_id');
        table.timestamps(true, true);
      });
    });
  }
}
