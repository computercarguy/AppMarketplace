import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";  

const secretName = process.env.secretName;
const client = new SecretsManagerClient({region: "us-west-2"});

export default async function useAwsSecrets (savelog: Function, cbfunc: any) {
    if (!secretName) {
        return;
    }
    
    if (global.secrets) {
        return global.secrets;
    }

    console.log("getting secrets");
    if (savelog) {
        //savelog("useAwsSecrets.js", "useAwsSecrets", "query", null, "getting secrets");
    }

    try {
        let response = await client.send(
            new GetSecretValueCommand({
                SecretId: secretName,
                VersionStage: "AWSCURRENT"
            })
        );
    
        if (!response) {
            console.log("getting secrets failed");
            if (savelog) {
                savelog("useAwsSecrets.js", "useAwsSecrets", "response", null, "getting secrets failed");
            }
            return;
        }

        const secret = JSON.parse(response.SecretString);
        global.secrets = secret;
        
        if (cbfunc) {
            cbfunc(secret);
        }
        else {
            return secret;
        }
    } catch (error) {
        // For a list of exceptions thrown, see
        // https://docs.aws.amazon.com/secretsmanager/latest/apireference/API_GetSecretValue.html
        if (savelog) {
            savelog("useAwsSecrets.js", "useAwsSecrets", "response", null, error);
        }
    }
}
