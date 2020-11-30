# manning-serverless

- [ ] Create a landing page
- [ ] Create API Gateway -> Lambda -> DynamoDB
  
* Protocol Buffers


- [ ] Display restaurants in landing page
- [ ] Secure APIs
  
#### Usage plans + API keys
* Designed for rate limiting, not authentication & authorization
* Allow client to access selected APIs at agreed upon request rates and quotas
* Request rate and quota apply to all APIs and stages covered by the usage plan

#### AWS_IAM (Authorization)

#### Custom Authorizer
1. Lambda
2. Cognito

- [ ] Cognito

### User Pools
* Registration
* Verify email/phone
* Secure sign-in
* Forgotten password
* Change password
* Sign out
* **Secure password handling with SRP protocol**
* Encrypt all data server-side
* Password policies
* Token-based authentication
* MFA
* Support CAPTCHA

- [ ] API cache, throttling
- [ ] Monitor & Alert with CloudWatch
- [ ] Testing

#### Conclusion
1. The risk of shipping broken software has largely shifted to how your Lambda functions integrate with external services
2. The risk of misconfiguration (both application & IAM) has exploded
3. The rick profile for a serverless application is very different to that of a serverful application


