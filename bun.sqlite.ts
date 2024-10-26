import { BunSqliteDialect } from "kysely-bun-sqlite";
import { Database } from "bun:sqlite";
import { KyselyStore } from "./kysely";
import { SessionStore } from "./types";

interface NewDatabaseOpts {
	/** Filename to use for SQLite sessions. */
	filename: string;
	/**
	 * Better-SQLite3 new Database options.
	 *
	 * Remember to install the db driver `'better-sqlite3'`.
	 *
	 * @see {@link https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md#new-databasepath-options Better-SQLite3 | new Database}
	 * */
	config?: | number | {
		readonly?: boolean;
		create?: boolean;
		readwrite?: boolean;
	},
	/** Called on fatal connection or setup errors */
	onInitError?: (err: unknown) => void;
}

interface ExistingDatabaseOpts {
	/** If passed, we'll reuse this instance of Better-SQLite3 Database instead of creating our own. */
	database: Database;
	/** Called on fatal connection or setup errors */
	onInitError?: (err: unknown) => void;
}

/** @unstable */
export function BunSQLite<Session>(opts: NewDatabaseOpts): SessionStore<Session>;
export function BunSQLite<Session>(opts: ExistingDatabaseOpts): SessionStore<Session>;
export function BunSQLite<Session>(opts: NewDatabaseOpts | ExistingDatabaseOpts) {
	return KyselyStore<Session>({
		config:
			"database" in opts
				? { dialect: new BunSqliteDialect({ database: opts.database }) }
				: { dialect: new BunSqliteDialect({ database: new Database(opts.filename, opts.config) }) },
		onInitError: opts.onInitError,
	});
}
