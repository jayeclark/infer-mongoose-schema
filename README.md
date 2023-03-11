# Installation

```shell
npm install --save infer-mongoose-schema
```
or
```shell
yarn add infer-mongoose-schema
```

# Purpose
To enable generation of Mongoose Schema based on an object, array of objects, class, or function.

This is an early alpha version released for a specific use case in another repository. Highly recommend waiting until v 1.0.0 to install.

# Example

```typescript
// User.js
import mongoose, { Schema } from mongoose;
import inferSchema from infer-mongoose-schema;

const SampleUser = {
  firstName: "John",
  lastName: "Smith",
  nickNames: ["JJ", "Smithy"],
  subscriptionTier: 1
}

const options = {
  defaultValues: {
    subscriptionTier: 0
  },
  stronglyTypeArrays: true
}

const userSchema = inferSchema(SampleUser, options)

export default mongoose.model('User', userSchema)
```
