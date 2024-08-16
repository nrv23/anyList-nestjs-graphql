

interface DbConfig {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entites: string[];
    synchronize: boolean;
}

const configDb : DbConfig = {
    type: "postgres",
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT!,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entites: [""],
    synchronize: true
}

export default configDb;