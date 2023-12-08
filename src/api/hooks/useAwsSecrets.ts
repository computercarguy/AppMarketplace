const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");  

console.log(process.env.NODE_ENV);
const environment = process.env.NODE_ENV.trim() || 'development';
let secret_name = environment == 'development' ? "MarketPlace" : "MarketPlaceProd";
const client = new SecretsManagerClient({region: "us-west-2"});

async function useAwsSecrets (cbfunc: any) {
    let response;

    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secret_name,
                VersionStage: "AWSCURRENT"
            })
        );
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }

    if (!response) {
        return;
    }

    const secret = JSON.parse(response.SecretString);

    if (cbfunc) {
        cbfunc(secret);
    }

    return secret;
}

export default useAwsSecrets;