<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/teamsfx](./teamsfx.md) &gt; [M365TenantCredential](./teamsfx.m365tenantcredential.md) &gt; [getToken](./teamsfx.m365tenantcredential.gettoken.md)

## M365TenantCredential.getToken() method

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Get access token for credential.

<b>Signature:</b>

```typescript
getToken(scopes: string | string[], options?: GetTokenOptions): Promise<AccessToken | null>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  scopes | string \| string\[\] | The list of scopes for which the token will have access. |
|  options | GetTokenOptions | The options used to configure any requests this TokenCredential implementation might make. |

<b>Returns:</b>

Promise&lt;AccessToken \| null&gt;

Access token with expected scopes. Throw error if get access token failed.

## Exceptions

[ServiceError](./teamsfx.errorcode.md) when get access token with authentication error.

[InternalError](./teamsfx.errorcode.md) when get access token with unknown error.

[InvalidParameter](./teamsfx.errorcode.md) when scopes is not a valid string or string array.

[RuntimeNotSupported](./teamsfx.errorcode.md) when runtime is nodeJS.

## Example


```typescript
await credential.getToken(["User.Read.All"]) // Get Graph access token for single scope using string array
await credential.getToken("User.Read.All") // Get Graph access token for single scope using string
await credential.getToken(["User.Read.All", "Calendars.Read"]) // Get Graph access token for multiple scopes using string array
await credential.getToken("User.Read.All Calendars.Read") // Get Graph access token for multiple scopes using space-separated string
await credential.getToken("https://graph.microsoft.com/User.Read.All") // Get Graph access token with full resource URI
await credential.getToken(["https://outlook.office.com/Mail.Read"]) // Get Outlook access token

```
