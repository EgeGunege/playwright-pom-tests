import sql from 'mssql';

/**
 * Utility class for working with Microsoft SQL Server in Node.js (ESM).
 * Reads connection details from process.env variables.
 */
export class DbUtils {
  constructor() {
    /** @type {sql.ConnectionPool | null} */
    this.pool = null;

    /** @type {sql.config} */
    this.config = {
      server: process.env.SQL_HOST,
      user: process.env.SQL_USER,
      password: process.env.SQL_PASS,
      database: process.env.SQL_DB,
      port: process.env.SQL_PORT ? parseInt(process.env.SQL_PORT, 10) : 1433,
      options: {
        encrypt: (process.env.SQL_ENCRYPT ?? 'true').toLowerCase() !== 'false',
        trustServerCertificate: (process.env.SQL_TRUST_CERT ?? 'false').toLowerCase() === 'true',
        enableArithAbort: true,
      },
      pool: {
        max: process.env.SQL_POOL_MAX ? parseInt(process.env.SQL_POOL_MAX, 10) : 10,
        min: 0,
        idleTimeoutMillis: process.env.SQL_POOL_IDLE_MS
          ? parseInt(process.env.SQL_POOL_IDLE_MS, 10)
          : 30000,
      },
      requestTimeout: process.env.SQL_REQ_TIMEOUT_MS
        ? parseInt(process.env.SQL_REQ_TIMEOUT_MS, 10)
        : 30000,
    };
  }

  /**
   * Get (or create) a singleton SQL connection pool.
   * @returns {Promise<sql.ConnectionPool>}
   */
  async getPool() {
    if (this.pool) return this.pool;
    this.pool = await sql.connect(this.config);
    return this.pool;
  }

  /**
   * Close the existing pool (useful for teardown).
   * @returns {Promise<void>}
   */
  async closePool() {
    if (this.pool) {
      await this.pool.close();
      this.pool = null;
    }
  }

  /**
   * Run a parameterized SQL query.
   * @param {string} queryText - SQL text with @named parameters.
   * @param {Record<string, any>} [params] - Parameters to bind.
   * @param {{ timeoutMs?: number, tx?: sql.Transaction }} [options] - Optional timeout or transaction.
   * @returns {Promise<sql.IResult<any>>}
   */
  async query(queryText, params = {}, options = {}) {
    const pool = options.tx ? options.tx : await this.getPool();
    const request = options.tx ? new sql.Request(options.tx) : pool.request();
    request.timeout = options.timeoutMs ?? this.config.requestTimeout;
    this._bindParams(request, params);
    return await request.query(queryText);
  }

  /**
   * Execute a stored procedure.
   * @param {string} procName - Procedure name (e.g. dbo.MyProc).
   * @param {{ inputs?: Record<string, any>, outputs?: Record<string, sql.ISqlType> }} [io] - Inputs/outputs.
   * @param {{ timeoutMs?: number, tx?: sql.Transaction }} [options] - Optional timeout or transaction.
   * @returns {Promise<sql.IProcedureResult<any>>}
   */
  async execute(procName, io = {}, options = {}) {
    const pool = options.tx ? options.tx : await this.getPool();
    const request = options.tx ? new sql.Request(options.tx) : pool.request();
    request.timeout = options.timeoutMs ?? this.config.requestTimeout;

    if (io.inputs) this._bindParams(request, io.inputs);
    if (io.outputs) {
      for (const [key, type] of Object.entries(io.outputs)) {
        request.output(key, type);
      }
    }
    return await request.execute(procName);
  }

  /**
   * Wrap operations in a transaction.
   * Automatically commits on success, rolls back on error.
   * @template T
   * @param {(rq: sql.Request, tx: sql.Transaction) => Promise<T>} work - Callback with a transaction-bound request.
   * @param {{ isolation?: number }} [options] - Optional isolation level.
   * @returns {Promise<T>}
   */
  async withTransaction(work, options = {}) {
    const pool = await this.getPool();
    const tx = new sql.Transaction(pool);
    await tx.begin(options.isolation);
    try {
      const rq = new sql.Request(tx);
      const result = await work(rq, tx);
      await tx.commit();
      return result;
    } catch (err) {
      try {
        await tx.rollback();
      } catch {}
      throw err;
    }
  }

  /**
   * Infer SQL type for a JS value.
   * @private
   * @param {any} val
   * @returns {sql.ISqlType}
   */
  _inferType(val) {
    if (val === null) return sql.NVarChar;
    switch (typeof val) {
      case 'string':
        return sql.NVarChar;
      case 'number':
        return Number.isInteger(val) ? sql.Int : sql.Float;
      case 'boolean':
        return sql.Bit;
      case 'object':
        if (val instanceof Date) return sql.DateTime2;
        return sql.NVarChar;
      default:
        return sql.NVarChar;
    }
  }

  /**
   * Bind params to a request object.
   * Supports plain values or { type, value } objects.
   * @private
   * @param {sql.Request} request
   * @param {Record<string, any>} params
   */
  _bindParams(request, params = {}) {
    for (const [key, spec] of Object.entries(params)) {
      if (spec && typeof spec === 'object' && 'type' in spec && 'value' in spec) {
        request.input(key, spec.type, spec.value);
      } else {
        request.input(key, this._inferType(spec), spec);
      }
    }
  }
}

export { sql };
