// Reference: https://www.npmjs.com/package/mysql2

import { OkPacket, Pool, ProcedureCallPacket, QueryError, ResultSetHeader, RowDataPacket, createPool } from 'mysql2';
import { Service } from 'typedi';
import useAwsSecrets from '../hooks/useAwsSecrets';

@Service()
export class DbWrapper {
    private pool: Pool = null;

    async query(queryString: string, queryValues: object, cbFunc: (arg0: { error: any; results: any; }) => void) {
        if (!this.pool) {
            let secrets = await useAwsSecrets(null);
            this.setPool(secrets);
        }

        let parameterizedQuery = this.queryFormat(queryString, queryValues);

        this.pool.query(parameterizedQuery, (error, results) => {
            if (cbFunc) {
                cbFunc(this.setResponse(error, results));
            }
        });
    }

    private queryFormat(query: string, values: object) {
        if (!values) {
            return query;
        }
        
        return query.replace(/\:(\w+)/g, (txt: string, key: string) => {
            if (values.hasOwnProperty(key)) {
                return encodeURI(values[key as keyof typeof values]).replace(/%20/g,  " ").replace(/%3A/g, ":");
            }
            
            return txt;
        });
    }

    async healthCheck() {
        if (!this.pool) {
            let secrets = await useAwsSecrets(null);
            this.setPool(secrets);
        }

        this.pool.getConnection((error, connection) => {
            connection.ping((err) => {
                if (err) throw err;

                console.log('Server responded to ping');
            });
        });
    }

    private setResponse(error: QueryError | null, results: OkPacket | RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | OkPacket[] | ProcedureCallPacket) {
        return {
            error: error,
            results: results ? results : null,
        };
    }

    private setPool(secrets) {
        if (secrets) {
            this.pool = createPool({
                user: secrets.user,
                host: secrets.host,
                database: secrets.database,
                password: secrets.password,
                port: secrets.port
            });
        }
    }
}
