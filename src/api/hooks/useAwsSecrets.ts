const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");  

const secretName = process.env.secretName ? process.env.secretName : "MarketPlace";
const client = new SecretsManagerClient({region: "us-west-2"});

async function useAwsSecrets (cbfunc: any) {
    let response;

    if (!secretName) {
        return;
    }

    try {
        response = await client.send(
            new GetSecretValueCommand({
                SecretId: secretName,
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