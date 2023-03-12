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

This is an early alpha version released for a specific use case in another repository. Highly recommend waiting until v 1.0.0 to install. Currently only object inference is implemented.

# Roadmap

## 0.0.x
Building out & refining object inference.  

Provide a sample object to `inferSchema`, along with an optional 'options' config object, and a valid mongoose schema will automatically be generated from the object. This helps reduce redundant code. Ideally, a project will have a central data model with the ability to generate sample objects of each entity (useful for unit testing), this sample object (or, eventually its class constructor) can then be used to generate a schema for mongoose.

This is an early alpha version released for a specific use case in another repository. Highly recommend waiting until v 1.0.0 to install. Currently only object inference is implemented.

## 1.0.0
Will add the ability to infer schema based on a class constructor function. Caveat: this package can only be successfully consumed by TypeScript projects compiling to ES6/ES2015.  

## 1.1.0
Will add the ability to infer schema based on an array of sample objects. For example, if a project contains a type of entity that has many optional properties, both a 'full' and a 'minimal' version of the entity can be provided to `inferSchema` and the fact that certain properties are optional will be interpreted from that input.

## 1.2.0
Will add the ability to infer schema based on a function that generates an object of the intended entity type. Useful for certain dependency injection use cases.

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
