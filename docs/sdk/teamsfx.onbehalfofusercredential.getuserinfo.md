<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [@microsoft/teamsfx](./teamsfx.md) &gt; [OnBehalfOfUserCredential](./teamsfx.onbehalfofusercredential.md) &gt; [getUserInfo](./teamsfx.onbehalfofusercredential.getuserinfo.md)

## OnBehalfOfUserCredential.getUserInfo() method

> This API is provided as a preview for developers and may change based on feedback that we receive. Do not use this API in a production environment.
> 

Get basic user info from SSO token.

<b>Signature:</b>

```typescript
getUserInfo(): UserInfo;
```
<b>Returns:</b>

[UserInfo](./teamsfx.userinfo.md)

Basic user info with user displayName, objectId and preferredUserName.

## Exceptions

[InternalError](./teamsfx.errorcode.md) when SSO token is not valid.

[RuntimeNotSupported](./teamsfx.errorcode.md) when runtime is browser.

## Example


```typescript
const currentUser = getUserInfo();

```

