const { SecretsManagerClient, GetSecretValueCommand } = require("@aws-sdk/client-secrets-manager");  

const secretName = process.env.secretName;
const client = new SecretsManagerClient({region: "us-west-2"});

export default async function useAwsSecrets (cbfunc: any) {
    if (!secretName) {
        return;
    }

    try {
        let response = await client.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: "AWSCURRENT"
            })
        );
    
        if (!response) {
            return;
        }

        const secret = JSON.parse(response.SecretString);

        if (cbfunc) {
            cbfunc(secret);
        }
        else {
            return secret;
        }
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        throw error;
    }
}
