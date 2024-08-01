# Azure Functions Example

### Prerequisites

1. [Create an Azure account.](https://azure.microsoft.com/en-us/free/)
2. [Set up Azure CLI](https://learn.microsoft.com/en-us/cli/azure/install-azure-cli)
3. [Install the Azure Functions Core Tools](https://learn.microsoft.com/en-us/azure/azure-functions/create-first-function-cli-typescript)

### Project Setup

Clone the example and install dependencies

```shell
git clone https://github.com/upstash/redis-js.git
cd redis-js/examples/azure-functions
npm install
```

### Create Azure Resources

You can use the command below to find the `name` of a region near you.

```shell
az account list-locations
```

Create a resource group.

```shell
az group create --name AzureFunctionsQuickstart-rg --location <REGION>
```

Create a storage account.

```shell
az storage account create --name <STORAGE_NAME> --location <REGION> --resource-group AzureFunctionsQuickstart-rg --sku Standard_LRS --allow-blob-public-access false
```

Create your Function App.

```shell
az functionapp create --resource-group AzureFunctionsQuickstart-rg --consumption-plan-location <REGION> --runtime node --runtime-version 18 --functions-version 4 --name <APP_NAME> --storage-account <STORAGE_NAME>
```

### Database Setup

Create a Redis database using [Upstash Console](https://console.upstash.com) or [Upstash CLI](https://github.com/upstash/cli) and set `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` in your Function App's settings.

```shell
az functionapp config appsettings set --name <APP_NAME> --resource-group AzureFunctionsQuickstart-rg --settings UPSTASH_REDIS_REST_URL=<YOUR_URL> UPSTASH_REDIS_REST_TOKEN=<YOUR_TOKEN>
```

### Deploy

Take a build of your application.

```shell
npm run build
```

Publish your application.

```shell
func azure functionapp publish <APP_NAME>
```

Visit the given Invoke URL.