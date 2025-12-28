import { z } from 'zod';
import { JsonValue, InputJsonValue, objectEnumValues } from '@prisma/client/runtime/library';
import type { Prisma } from '../prisma/browser.js';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

// JSON
//------------------------------------------------------

export type NullableJsonInput = JsonValue | null | 'JsonNull' | 'DbNull' | typeof objectEnumValues.instances.DbNull | typeof objectEnumValues.instances.JsonNull;

export const transformJsonNull = (v?: NullableJsonInput) => {
  if (!v || v === 'DbNull') return typeof objectEnumValues.instances.DbNull;
  if (v === 'JsonNull') return typeof objectEnumValues.instances.JsonNull;
  return v;
};

export const JsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.literal(null),
    z.record(z.string(), z.lazy(() => JsonValueSchema.optional())),
    z.array(z.lazy(() => JsonValueSchema)),
  ])
);

export type JsonValueType = z.infer<typeof JsonValueSchema>;

export const NullableJsonValue = z
  .union([JsonValueSchema, z.literal('DbNull'), z.literal('JsonNull')])
  .nullable()
  .transform((v) => transformJsonNull(v));

export type NullableJsonValueType = z.infer<typeof NullableJsonValue>;

export const InputJsonValueSchema: z.ZodType<InputJsonValue> = z.lazy(() =>
  z.union([
    z.string(),
    z.number(),
    z.boolean(),
    z.object({ toJSON: z.any() }),
    z.record(z.string(), z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
    z.array(z.lazy(() => z.union([InputJsonValueSchema, z.literal(null)]))),
  ])
);

export type InputJsonValueType = z.infer<typeof InputJsonValueSchema>;


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const UserScalarFieldEnumSchema = z.enum(['id','name','email','password','role','created_at','updated_at','phoneNumber','likedProductIds']);

export const AuthTokenScalarFieldEnumSchema = z.enum(['id','token','createdAt','expiresAt','userId']);

export const ProductScalarFieldEnumSchema = z.enum(['id','name','price','type','data','imageUrl','imageName','isReserved','likedByUserIds','reservedByUserId']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const ProductTypeSchema = z.enum(['CLOTHES','SHOE','HAT','PERFUME','BAG']);

export type ProductTypeType = `${z.infer<typeof ProductTypeSchema>}`

export const UserTypeSchema = z.enum(['ADMIN','USER']);

export type UserTypeType = `${z.infer<typeof UserTypeSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  role: UserTypeSchema,
  id: z.string(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date().nullable(),
  phoneNumber: z.string().nullable(),
  likedProductIds: z.string().array(),
})

export type User = z.infer<typeof UserSchema>

/////////////////////////////////////////
// AUTH TOKEN SCHEMA
/////////////////////////////////////////

export const AuthTokenSchema = z.object({
  id: z.string(),
  token: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  userId: z.string(),
})

export type AuthToken = z.infer<typeof AuthTokenSchema>

/////////////////////////////////////////
// PRODUCT SCHEMA
/////////////////////////////////////////

export const ProductSchema = z.object({
  type: ProductTypeSchema,
  id: z.string(),
  name: z.string(),
  price: z.number().nullable(),
  data: JsonValueSchema,
  imageUrl: z.string(),
  imageName: z.string(),
  isReserved: z.boolean(),
  likedByUserIds: z.string().array(),
  reservedByUserId: z.string().nullable(),
})

export type Product = z.infer<typeof ProductSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// USER
//------------------------------------------------------

export const UserIncludeSchema: z.ZodType<Prisma.UserInclude> = z.object({
}).strict();

export const UserArgsSchema: z.ZodType<Prisma.UserDefaultArgs> = z.object({
  select: z.lazy(() => UserSelectSchema).optional(),
  include: z.lazy(() => UserIncludeSchema).optional(),
}).strict();

export const UserCountOutputTypeArgsSchema: z.ZodType<Prisma.UserCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => UserCountOutputTypeSelectSchema).nullish(),
}).strict();

export const UserCountOutputTypeSelectSchema: z.ZodType<Prisma.UserCountOutputTypeSelect> = z.object({
  likedProducts: z.boolean().optional(),
  reservedProducts: z.boolean().optional(),
}).strict();

export const UserSelectSchema: z.ZodType<Prisma.UserSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  email: z.boolean().optional(),
  password: z.boolean().optional(),
  role: z.boolean().optional(),
  created_at: z.boolean().optional(),
  updated_at: z.boolean().optional(),
  phoneNumber: z.boolean().optional(),
  likedProductIds: z.boolean().optional(),
  authToken: z.union([z.boolean(),z.lazy(() => AuthTokenArgsSchema)]).optional(),
  likedProducts: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  reservedProducts: z.union([z.boolean(),z.lazy(() => ProductArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => UserCountOutputTypeArgsSchema)]).optional(),
}).strict()

// AUTH TOKEN
//------------------------------------------------------

export const AuthTokenIncludeSchema: z.ZodType<Prisma.AuthTokenInclude> = z.object({
}).strict();

export const AuthTokenArgsSchema: z.ZodType<Prisma.AuthTokenDefaultArgs> = z.object({
  select: z.lazy(() => AuthTokenSelectSchema).optional(),
  include: z.lazy(() => AuthTokenIncludeSchema).optional(),
}).strict();

export const AuthTokenSelectSchema: z.ZodType<Prisma.AuthTokenSelect> = z.object({
  id: z.boolean().optional(),
  token: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  expiresAt: z.boolean().optional(),
  userId: z.boolean().optional(),
  user: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
}).strict()

// PRODUCT
//------------------------------------------------------

export const ProductIncludeSchema: z.ZodType<Prisma.ProductInclude> = z.object({
}).strict();

export const ProductArgsSchema: z.ZodType<Prisma.ProductDefaultArgs> = z.object({
  select: z.lazy(() => ProductSelectSchema).optional(),
  include: z.lazy(() => ProductIncludeSchema).optional(),
}).strict();

export const ProductCountOutputTypeArgsSchema: z.ZodType<Prisma.ProductCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => ProductCountOutputTypeSelectSchema).nullish(),
}).strict();

export const ProductCountOutputTypeSelectSchema: z.ZodType<Prisma.ProductCountOutputTypeSelect> = z.object({
  likedByUsers: z.boolean().optional(),
}).strict();

export const ProductSelectSchema: z.ZodType<Prisma.ProductSelect> = z.object({
  id: z.boolean().optional(),
  name: z.boolean().optional(),
  price: z.boolean().optional(),
  type: z.boolean().optional(),
  data: z.boolean().optional(),
  imageUrl: z.boolean().optional(),
  imageName: z.boolean().optional(),
  isReserved: z.boolean().optional(),
  likedByUserIds: z.boolean().optional(),
  reservedByUserId: z.boolean().optional(),
  likedByUsers: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  reservedByUser: z.union([z.boolean(),z.lazy(() => UserArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => ProductCountOutputTypeArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const UserWhereInputSchema: z.ZodType<Prisma.UserWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserTypeFilterSchema), z.lazy(() => UserTypeSchema) ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  likedProductIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  authToken: z.union([ z.lazy(() => AuthTokenNullableScalarRelationFilterSchema), z.lazy(() => AuthTokenWhereInputSchema) ]).optional().nullable(),
  likedProducts: z.lazy(() => ProductListRelationFilterSchema).optional(),
  reservedProducts: z.lazy(() => ProductListRelationFilterSchema).optional(),
});

export const UserOrderByWithRelationInputSchema: z.ZodType<Prisma.UserOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  likedProductIds: z.lazy(() => SortOrderSchema).optional(),
  authToken: z.lazy(() => AuthTokenOrderByWithRelationInputSchema).optional(),
  likedProducts: z.lazy(() => ProductOrderByRelationAggregateInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductOrderByRelationAggregateInputSchema).optional(),
});

export const UserWhereUniqueInputSchema: z.ZodType<Prisma.UserWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    email: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.strictObject({
  id: z.string().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserWhereInputSchema), z.lazy(() => UserWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserTypeFilterSchema), z.lazy(() => UserTypeSchema) ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  likedProductIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  authToken: z.union([ z.lazy(() => AuthTokenNullableScalarRelationFilterSchema), z.lazy(() => AuthTokenWhereInputSchema) ]).optional().nullable(),
  likedProducts: z.lazy(() => ProductListRelationFilterSchema).optional(),
  reservedProducts: z.lazy(() => ProductListRelationFilterSchema).optional(),
}));

export const UserOrderByWithAggregationInputSchema: z.ZodType<Prisma.UserOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  likedProductIds: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => UserCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => UserMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => UserMinOrderByAggregateInputSchema).optional(),
});

export const UserScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.UserScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereWithAggregatesInputSchema), z.lazy(() => UserScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserTypeWithAggregatesFilterSchema), z.lazy(() => UserTypeSchema) ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeNullableWithAggregatesFilterSchema), z.coerce.date() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
  likedProductIds: z.lazy(() => StringNullableListFilterSchema).optional(),
});

export const AuthTokenWhereInputSchema: z.ZodType<Prisma.AuthTokenWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AuthTokenWhereInputSchema), z.lazy(() => AuthTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthTokenWhereInputSchema), z.lazy(() => AuthTokenWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
});

export const AuthTokenOrderByWithRelationInputSchema: z.ZodType<Prisma.AuthTokenOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  user: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const AuthTokenWhereUniqueInputSchema: z.ZodType<Prisma.AuthTokenWhereUniqueInput> = z.union([
  z.object({
    id: z.string(),
    token: z.string(),
    userId: z.string(),
  }),
  z.object({
    id: z.string(),
    token: z.string(),
  }),
  z.object({
    id: z.string(),
    userId: z.string(),
  }),
  z.object({
    id: z.string(),
  }),
  z.object({
    token: z.string(),
    userId: z.string(),
  }),
  z.object({
    token: z.string(),
  }),
  z.object({
    userId: z.string(),
  }),
])
.and(z.strictObject({
  id: z.string().optional(),
  token: z.string().optional(),
  userId: z.string().optional(),
  AND: z.union([ z.lazy(() => AuthTokenWhereInputSchema), z.lazy(() => AuthTokenWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthTokenWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthTokenWhereInputSchema), z.lazy(() => AuthTokenWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  user: z.union([ z.lazy(() => UserScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional(),
}));

export const AuthTokenOrderByWithAggregationInputSchema: z.ZodType<Prisma.AuthTokenOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AuthTokenCountOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AuthTokenMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AuthTokenMinOrderByAggregateInputSchema).optional(),
});

export const AuthTokenScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AuthTokenScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => AuthTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => AuthTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AuthTokenScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AuthTokenScalarWhereWithAggregatesInputSchema), z.lazy(() => AuthTokenScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  token: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  expiresAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema), z.coerce.date() ]).optional(),
  userId: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
});

export const ProductWhereInputSchema: z.ZodType<Prisma.ProductWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumProductTypeFilterSchema), z.lazy(() => ProductTypeSchema) ]).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  imageUrl: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imageName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isReserved: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  likedByUserIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  reservedByUserId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  likedByUsers: z.lazy(() => UserListRelationFilterSchema).optional(),
  reservedByUser: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
});

export const ProductOrderByWithRelationInputSchema: z.ZodType<Prisma.ProductOrderByWithRelationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  imageName: z.lazy(() => SortOrderSchema).optional(),
  isReserved: z.lazy(() => SortOrderSchema).optional(),
  likedByUserIds: z.lazy(() => SortOrderSchema).optional(),
  reservedByUserId: z.lazy(() => SortOrderSchema).optional(),
  likedByUsers: z.lazy(() => UserOrderByRelationAggregateInputSchema).optional(),
  reservedByUser: z.lazy(() => UserOrderByWithRelationInputSchema).optional(),
});

export const ProductWhereUniqueInputSchema: z.ZodType<Prisma.ProductWhereUniqueInput> = z.object({
  id: z.string(),
})
.and(z.strictObject({
  id: z.string().optional(),
  AND: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductWhereInputSchema), z.lazy(() => ProductWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumProductTypeFilterSchema), z.lazy(() => ProductTypeSchema) ]).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  imageUrl: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imageName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isReserved: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  likedByUserIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  reservedByUserId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  likedByUsers: z.lazy(() => UserListRelationFilterSchema).optional(),
  reservedByUser: z.union([ z.lazy(() => UserNullableScalarRelationFilterSchema), z.lazy(() => UserWhereInputSchema) ]).optional().nullable(),
}));

export const ProductOrderByWithAggregationInputSchema: z.ZodType<Prisma.ProductOrderByWithAggregationInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  imageName: z.lazy(() => SortOrderSchema).optional(),
  isReserved: z.lazy(() => SortOrderSchema).optional(),
  likedByUserIds: z.lazy(() => SortOrderSchema).optional(),
  reservedByUserId: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => ProductCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => ProductAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => ProductMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => ProductMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => ProductSumOrderByAggregateInputSchema).optional(),
});

export const ProductScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.ProductScalarWhereWithAggregatesInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema), z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereWithAggregatesInputSchema), z.lazy(() => ProductScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => FloatNullableWithAggregatesFilterSchema), z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumProductTypeWithAggregatesFilterSchema), z.lazy(() => ProductTypeSchema) ]).optional(),
  data: z.lazy(() => JsonWithAggregatesFilterSchema).optional(),
  imageUrl: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  imageName: z.union([ z.lazy(() => StringWithAggregatesFilterSchema), z.string() ]).optional(),
  isReserved: z.union([ z.lazy(() => BoolWithAggregatesFilterSchema), z.boolean() ]).optional(),
  likedByUserIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  reservedByUserId: z.union([ z.lazy(() => StringNullableWithAggregatesFilterSchema), z.string() ]).optional().nullable(),
});

export const UserCreateInputSchema: z.ZodType<Prisma.UserCreateInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => UserTypeSchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  authToken: z.lazy(() => AuthTokenCreateNestedOneWithoutUserInputSchema).optional(),
  likedProducts: z.lazy(() => ProductCreateNestedManyWithoutLikedByUsersInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductCreateNestedManyWithoutReservedByUserInputSchema).optional(),
});

export const UserUncheckedCreateInputSchema: z.ZodType<Prisma.UserUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => UserTypeSchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserCreatelikedProductIdsInputSchema), z.string().array() ]).optional(),
  authToken: z.lazy(() => AuthTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  likedProducts: z.lazy(() => ProductUncheckedCreateNestedManyWithoutLikedByUsersInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductUncheckedCreateNestedManyWithoutReservedByUserInputSchema).optional(),
});

export const UserUpdateInputSchema: z.ZodType<Prisma.UserUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  authToken: z.lazy(() => AuthTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  likedProducts: z.lazy(() => ProductUpdateManyWithoutLikedByUsersNestedInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductUpdateManyWithoutReservedByUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateInputSchema: z.ZodType<Prisma.UserUncheckedUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserUpdatelikedProductIdsInputSchema), z.string().array() ]).optional(),
  authToken: z.lazy(() => AuthTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  likedProducts: z.lazy(() => ProductUncheckedUpdateManyWithoutLikedByUsersNestedInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductUncheckedUpdateManyWithoutReservedByUserNestedInputSchema).optional(),
});

export const UserCreateManyInputSchema: z.ZodType<Prisma.UserCreateManyInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => UserTypeSchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserCreatelikedProductIdsInputSchema), z.string().array() ]).optional(),
});

export const UserUpdateManyMutationInputSchema: z.ZodType<Prisma.UserUpdateManyMutationInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const UserUncheckedUpdateManyInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserUpdatelikedProductIdsInputSchema), z.string().array() ]).optional(),
});

export const AuthTokenCreateInputSchema: z.ZodType<Prisma.AuthTokenCreateInput> = z.strictObject({
  id: z.string().optional(),
  token: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  user: z.lazy(() => UserCreateNestedOneWithoutAuthTokenInputSchema),
});

export const AuthTokenUncheckedCreateInputSchema: z.ZodType<Prisma.AuthTokenUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  token: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  userId: z.string(),
});

export const AuthTokenUpdateInputSchema: z.ZodType<Prisma.AuthTokenUpdateInput> = z.strictObject({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  user: z.lazy(() => UserUpdateOneRequiredWithoutAuthTokenNestedInputSchema).optional(),
});

export const AuthTokenUncheckedUpdateInputSchema: z.ZodType<Prisma.AuthTokenUncheckedUpdateInput> = z.strictObject({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AuthTokenCreateManyInputSchema: z.ZodType<Prisma.AuthTokenCreateManyInput> = z.strictObject({
  id: z.string().optional(),
  token: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
  userId: z.string(),
});

export const AuthTokenUpdateManyMutationInputSchema: z.ZodType<Prisma.AuthTokenUpdateManyMutationInput> = z.strictObject({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AuthTokenUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AuthTokenUncheckedUpdateManyInput> = z.strictObject({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  userId: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductCreateInputSchema: z.ZodType<Prisma.ProductCreateInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  price: z.number().optional().nullable(),
  type: z.lazy(() => ProductTypeSchema),
  data: InputJsonValueSchema,
  imageUrl: z.string(),
  imageName: z.string(),
  isReserved: z.boolean().optional(),
  likedByUsers: z.lazy(() => UserCreateNestedManyWithoutLikedProductsInputSchema).optional(),
  reservedByUser: z.lazy(() => UserCreateNestedOneWithoutReservedProductsInputSchema).optional(),
});

export const ProductUncheckedCreateInputSchema: z.ZodType<Prisma.ProductUncheckedCreateInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  price: z.number().optional().nullable(),
  type: z.lazy(() => ProductTypeSchema),
  data: InputJsonValueSchema,
  imageUrl: z.string(),
  imageName: z.string(),
  isReserved: z.boolean().optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductCreatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
  reservedByUserId: z.string().optional().nullable(),
  likedByUsers: z.lazy(() => UserUncheckedCreateNestedManyWithoutLikedProductsInputSchema).optional(),
});

export const ProductUpdateInputSchema: z.ZodType<Prisma.ProductUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  likedByUsers: z.lazy(() => UserUpdateManyWithoutLikedProductsNestedInputSchema).optional(),
  reservedByUser: z.lazy(() => UserUpdateOneWithoutReservedProductsNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductUpdatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
  reservedByUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likedByUsers: z.lazy(() => UserUncheckedUpdateManyWithoutLikedProductsNestedInputSchema).optional(),
});

export const ProductCreateManyInputSchema: z.ZodType<Prisma.ProductCreateManyInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  price: z.number().optional().nullable(),
  type: z.lazy(() => ProductTypeSchema),
  data: InputJsonValueSchema,
  imageUrl: z.string(),
  imageName: z.string(),
  isReserved: z.boolean().optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductCreatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
  reservedByUserId: z.string().optional().nullable(),
});

export const ProductUpdateManyMutationInputSchema: z.ZodType<Prisma.ProductUpdateManyMutationInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductUncheckedUpdateManyInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductUpdatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
  reservedByUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const EnumUserTypeFilterSchema: z.ZodType<Prisma.EnumUserTypeFilter> = z.strictObject({
  equals: z.lazy(() => UserTypeSchema).optional(),
  in: z.lazy(() => UserTypeSchema).array().optional(),
  notIn: z.lazy(() => UserTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => NestedEnumUserTypeFilterSchema) ]).optional(),
});

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const DateTimeNullableFilterSchema: z.ZodType<Prisma.DateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional(),
});

export const StringNullableFilterSchema: z.ZodType<Prisma.StringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional(),
});

export const StringNullableListFilterSchema: z.ZodType<Prisma.StringNullableListFilter> = z.strictObject({
  equals: z.string().array().optional().nullable(),
  has: z.string().optional().nullable(),
  hasEvery: z.string().array().optional(),
  hasSome: z.string().array().optional(),
  isEmpty: z.boolean().optional(),
});

export const AuthTokenNullableScalarRelationFilterSchema: z.ZodType<Prisma.AuthTokenNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => AuthTokenWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => AuthTokenWhereInputSchema).optional().nullable(),
});

export const ProductListRelationFilterSchema: z.ZodType<Prisma.ProductListRelationFilter> = z.strictObject({
  every: z.lazy(() => ProductWhereInputSchema).optional(),
  some: z.lazy(() => ProductWhereInputSchema).optional(),
  none: z.lazy(() => ProductWhereInputSchema).optional(),
});

export const ProductOrderByRelationAggregateInputSchema: z.ZodType<Prisma.ProductOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const UserCountOrderByAggregateInputSchema: z.ZodType<Prisma.UserCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
  likedProductIds: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMaxOrderByAggregateInputSchema: z.ZodType<Prisma.UserMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
});

export const UserMinOrderByAggregateInputSchema: z.ZodType<Prisma.UserMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  password: z.lazy(() => SortOrderSchema).optional(),
  role: z.lazy(() => SortOrderSchema).optional(),
  created_at: z.lazy(() => SortOrderSchema).optional(),
  updated_at: z.lazy(() => SortOrderSchema).optional(),
  phoneNumber: z.lazy(() => SortOrderSchema).optional(),
});

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const EnumUserTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumUserTypeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => UserTypeSchema).optional(),
  in: z.lazy(() => UserTypeSchema).array().optional(),
  notIn: z.lazy(() => UserTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => NestedEnumUserTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserTypeFilterSchema).optional(),
});

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const DateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  isSet: z.boolean().optional(),
});

export const StringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.StringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  mode: z.lazy(() => QueryModeSchema).optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  isSet: z.boolean().optional(),
});

export const UserScalarRelationFilterSchema: z.ZodType<Prisma.UserScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional(),
  isNot: z.lazy(() => UserWhereInputSchema).optional(),
});

export const AuthTokenCountOrderByAggregateInputSchema: z.ZodType<Prisma.AuthTokenCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const AuthTokenMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AuthTokenMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const AuthTokenMinOrderByAggregateInputSchema: z.ZodType<Prisma.AuthTokenMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  token: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  expiresAt: z.lazy(() => SortOrderSchema).optional(),
  userId: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatNullableFilterSchema: z.ZodType<Prisma.FloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional(),
});

export const EnumProductTypeFilterSchema: z.ZodType<Prisma.EnumProductTypeFilter> = z.strictObject({
  equals: z.lazy(() => ProductTypeSchema).optional(),
  in: z.lazy(() => ProductTypeSchema).array().optional(),
  notIn: z.lazy(() => ProductTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => NestedEnumProductTypeFilterSchema) ]).optional(),
});

export const JsonFilterSchema: z.ZodType<Prisma.JsonFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
});

export const BoolFilterSchema: z.ZodType<Prisma.BoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const UserListRelationFilterSchema: z.ZodType<Prisma.UserListRelationFilter> = z.strictObject({
  every: z.lazy(() => UserWhereInputSchema).optional(),
  some: z.lazy(() => UserWhereInputSchema).optional(),
  none: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserNullableScalarRelationFilterSchema: z.ZodType<Prisma.UserNullableScalarRelationFilter> = z.strictObject({
  is: z.lazy(() => UserWhereInputSchema).optional().nullable(),
  isNot: z.lazy(() => UserWhereInputSchema).optional().nullable(),
});

export const UserOrderByRelationAggregateInputSchema: z.ZodType<Prisma.UserOrderByRelationAggregateInput> = z.strictObject({
  _count: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductCountOrderByAggregateInputSchema: z.ZodType<Prisma.ProductCountOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  data: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  imageName: z.lazy(() => SortOrderSchema).optional(),
  isReserved: z.lazy(() => SortOrderSchema).optional(),
  likedByUserIds: z.lazy(() => SortOrderSchema).optional(),
  reservedByUserId: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductAvgOrderByAggregateInputSchema: z.ZodType<Prisma.ProductAvgOrderByAggregateInput> = z.strictObject({
  price: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductMaxOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMaxOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  imageName: z.lazy(() => SortOrderSchema).optional(),
  isReserved: z.lazy(() => SortOrderSchema).optional(),
  reservedByUserId: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductMinOrderByAggregateInputSchema: z.ZodType<Prisma.ProductMinOrderByAggregateInput> = z.strictObject({
  id: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  price: z.lazy(() => SortOrderSchema).optional(),
  type: z.lazy(() => SortOrderSchema).optional(),
  imageUrl: z.lazy(() => SortOrderSchema).optional(),
  imageName: z.lazy(() => SortOrderSchema).optional(),
  isReserved: z.lazy(() => SortOrderSchema).optional(),
  reservedByUserId: z.lazy(() => SortOrderSchema).optional(),
});

export const ProductSumOrderByAggregateInputSchema: z.ZodType<Prisma.ProductSumOrderByAggregateInput> = z.strictObject({
  price: z.lazy(() => SortOrderSchema).optional(),
});

export const FloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.FloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  isSet: z.boolean().optional(),
});

export const EnumProductTypeWithAggregatesFilterSchema: z.ZodType<Prisma.EnumProductTypeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ProductTypeSchema).optional(),
  in: z.lazy(() => ProductTypeSchema).array().optional(),
  notIn: z.lazy(() => ProductTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => NestedEnumProductTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProductTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProductTypeFilterSchema).optional(),
});

export const JsonWithAggregatesFilterSchema: z.ZodType<Prisma.JsonWithAggregatesFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedJsonFilterSchema).optional(),
  _max: z.lazy(() => NestedJsonFilterSchema).optional(),
});

export const BoolWithAggregatesFilterSchema: z.ZodType<Prisma.BoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const AuthTokenCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AuthTokenCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AuthTokenCreateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AuthTokenCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AuthTokenWhereUniqueInputSchema).optional(),
});

export const ProductCreateNestedManyWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutLikedByUsersInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutLikedByUsersInputSchema), z.lazy(() => ProductCreateOrConnectWithoutLikedByUsersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
});

export const ProductCreateNestedManyWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductCreateNestedManyWithoutReservedByUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductCreateWithoutReservedByUserInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutReservedByUserInputSchema), z.lazy(() => ProductCreateOrConnectWithoutReservedByUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyReservedByUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
});

export const UserCreatelikedProductIdsInputSchema: z.ZodType<Prisma.UserCreatelikedProductIdsInput> = z.strictObject({
  set: z.string().array(),
});

export const AuthTokenUncheckedCreateNestedOneWithoutUserInputSchema: z.ZodType<Prisma.AuthTokenUncheckedCreateNestedOneWithoutUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => AuthTokenCreateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AuthTokenCreateOrConnectWithoutUserInputSchema).optional(),
  connect: z.lazy(() => AuthTokenWhereUniqueInputSchema).optional(),
});

export const ProductUncheckedCreateNestedManyWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutLikedByUsersInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutLikedByUsersInputSchema), z.lazy(() => ProductCreateOrConnectWithoutLikedByUsersInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
});

export const ProductUncheckedCreateNestedManyWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductUncheckedCreateNestedManyWithoutReservedByUserInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductCreateWithoutReservedByUserInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutReservedByUserInputSchema), z.lazy(() => ProductCreateOrConnectWithoutReservedByUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyReservedByUserInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
});

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional(),
});

export const EnumUserTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumUserTypeFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => UserTypeSchema).optional(),
});

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional(),
});

export const NullableDateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableDateTimeFieldUpdateOperationsInput> = z.strictObject({
  set: z.coerce.date().optional().nullable(),
  unset: z.boolean().optional(),
});

export const NullableStringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableStringFieldUpdateOperationsInput> = z.strictObject({
  set: z.string().optional().nullable(),
  unset: z.boolean().optional(),
});

export const AuthTokenUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.AuthTokenUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AuthTokenCreateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AuthTokenCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AuthTokenUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AuthTokenWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AuthTokenWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AuthTokenWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AuthTokenUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => AuthTokenUpdateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const ProductUpdateManyWithoutLikedByUsersNestedInputSchema: z.ZodType<Prisma.ProductUpdateManyWithoutLikedByUsersNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutLikedByUsersInputSchema), z.lazy(() => ProductCreateOrConnectWithoutLikedByUsersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutLikedByUsersInputSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutLikedByUsersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutLikedByUsersInputSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutLikedByUsersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutLikedByUsersInputSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutLikedByUsersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
});

export const ProductUpdateManyWithoutReservedByUserNestedInputSchema: z.ZodType<Prisma.ProductUpdateManyWithoutReservedByUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductCreateWithoutReservedByUserInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutReservedByUserInputSchema), z.lazy(() => ProductCreateOrConnectWithoutReservedByUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutReservedByUserInputSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutReservedByUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyReservedByUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutReservedByUserInputSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutReservedByUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutReservedByUserInputSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutReservedByUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
});

export const UserUpdatelikedProductIdsInputSchema: z.ZodType<Prisma.UserUpdatelikedProductIdsInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const AuthTokenUncheckedUpdateOneWithoutUserNestedInputSchema: z.ZodType<Prisma.AuthTokenUncheckedUpdateOneWithoutUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => AuthTokenCreateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedCreateWithoutUserInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => AuthTokenCreateOrConnectWithoutUserInputSchema).optional(),
  upsert: z.lazy(() => AuthTokenUpsertWithoutUserInputSchema).optional(),
  disconnect: z.union([ z.boolean(),z.lazy(() => AuthTokenWhereInputSchema) ]).optional(),
  delete: z.union([ z.boolean(),z.lazy(() => AuthTokenWhereInputSchema) ]).optional(),
  connect: z.lazy(() => AuthTokenWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => AuthTokenUpdateToOneWithWhereWithoutUserInputSchema), z.lazy(() => AuthTokenUpdateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedUpdateWithoutUserInputSchema) ]).optional(),
});

export const ProductUncheckedUpdateManyWithoutLikedByUsersNestedInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutLikedByUsersNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutLikedByUsersInputSchema), z.lazy(() => ProductCreateOrConnectWithoutLikedByUsersInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutLikedByUsersInputSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutLikedByUsersInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutLikedByUsersInputSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutLikedByUsersInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutLikedByUsersInputSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutLikedByUsersInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
});

export const ProductUncheckedUpdateManyWithoutReservedByUserNestedInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutReservedByUserNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => ProductCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductCreateWithoutReservedByUserInputSchema).array(), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => ProductCreateOrConnectWithoutReservedByUserInputSchema), z.lazy(() => ProductCreateOrConnectWithoutReservedByUserInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => ProductUpsertWithWhereUniqueWithoutReservedByUserInputSchema), z.lazy(() => ProductUpsertWithWhereUniqueWithoutReservedByUserInputSchema).array() ]).optional(),
  createMany: z.lazy(() => ProductCreateManyReservedByUserInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => ProductWhereUniqueInputSchema), z.lazy(() => ProductWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => ProductUpdateWithWhereUniqueWithoutReservedByUserInputSchema), z.lazy(() => ProductUpdateWithWhereUniqueWithoutReservedByUserInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => ProductUpdateManyWithWhereWithoutReservedByUserInputSchema), z.lazy(() => ProductUpdateManyWithWhereWithoutReservedByUserInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutAuthTokenInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutAuthTokenInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAuthTokenInputSchema), z.lazy(() => UserUncheckedCreateWithoutAuthTokenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAuthTokenInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const UserUpdateOneRequiredWithoutAuthTokenNestedInputSchema: z.ZodType<Prisma.UserUpdateOneRequiredWithoutAuthTokenNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutAuthTokenInputSchema), z.lazy(() => UserUncheckedCreateWithoutAuthTokenInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutAuthTokenInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutAuthTokenInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutAuthTokenInputSchema), z.lazy(() => UserUpdateWithoutAuthTokenInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAuthTokenInputSchema) ]).optional(),
});

export const UserCreateNestedManyWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserCreateNestedManyWithoutLikedProductsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutLikedProductsInputSchema), z.lazy(() => UserCreateWithoutLikedProductsInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutLikedProductsInputSchema), z.lazy(() => UserCreateOrConnectWithoutLikedProductsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
});

export const UserCreateNestedOneWithoutReservedProductsInputSchema: z.ZodType<Prisma.UserCreateNestedOneWithoutReservedProductsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutReservedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutReservedProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReservedProductsInputSchema).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
});

export const ProductCreatelikedByUserIdsInputSchema: z.ZodType<Prisma.ProductCreatelikedByUserIdsInput> = z.strictObject({
  set: z.string().array(),
});

export const UserUncheckedCreateNestedManyWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserUncheckedCreateNestedManyWithoutLikedProductsInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutLikedProductsInputSchema), z.lazy(() => UserCreateWithoutLikedProductsInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutLikedProductsInputSchema), z.lazy(() => UserCreateOrConnectWithoutLikedProductsInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
});

export const NullableFloatFieldUpdateOperationsInputSchema: z.ZodType<Prisma.NullableFloatFieldUpdateOperationsInput> = z.strictObject({
  set: z.number().optional().nullable(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional(),
  unset: z.boolean().optional(),
});

export const EnumProductTypeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.EnumProductTypeFieldUpdateOperationsInput> = z.strictObject({
  set: z.lazy(() => ProductTypeSchema).optional(),
});

export const BoolFieldUpdateOperationsInputSchema: z.ZodType<Prisma.BoolFieldUpdateOperationsInput> = z.strictObject({
  set: z.boolean().optional(),
});

export const UserUpdateManyWithoutLikedProductsNestedInputSchema: z.ZodType<Prisma.UserUpdateManyWithoutLikedProductsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutLikedProductsInputSchema), z.lazy(() => UserCreateWithoutLikedProductsInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutLikedProductsInputSchema), z.lazy(() => UserCreateOrConnectWithoutLikedProductsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutLikedProductsInputSchema), z.lazy(() => UserUpsertWithWhereUniqueWithoutLikedProductsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutLikedProductsInputSchema), z.lazy(() => UserUpdateWithWhereUniqueWithoutLikedProductsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutLikedProductsInputSchema), z.lazy(() => UserUpdateManyWithWhereWithoutLikedProductsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
});

export const UserUpdateOneWithoutReservedProductsNestedInputSchema: z.ZodType<Prisma.UserUpdateOneWithoutReservedProductsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutReservedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutReservedProductsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => UserCreateOrConnectWithoutReservedProductsInputSchema).optional(),
  upsert: z.lazy(() => UserUpsertWithoutReservedProductsInputSchema).optional(),
  disconnect: z.boolean().optional(),
  delete: z.union([ z.boolean(),z.lazy(() => UserWhereInputSchema) ]).optional(),
  connect: z.lazy(() => UserWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => UserUpdateToOneWithWhereWithoutReservedProductsInputSchema), z.lazy(() => UserUpdateWithoutReservedProductsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutReservedProductsInputSchema) ]).optional(),
});

export const ProductUpdatelikedByUserIdsInputSchema: z.ZodType<Prisma.ProductUpdatelikedByUserIdsInput> = z.strictObject({
  set: z.string().array().optional(),
  push: z.union([ z.string(),z.string().array() ]).optional(),
});

export const UserUncheckedUpdateManyWithoutLikedProductsNestedInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutLikedProductsNestedInput> = z.strictObject({
  create: z.union([ z.lazy(() => UserCreateWithoutLikedProductsInputSchema), z.lazy(() => UserCreateWithoutLikedProductsInputSchema).array(), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => UserCreateOrConnectWithoutLikedProductsInputSchema), z.lazy(() => UserCreateOrConnectWithoutLikedProductsInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => UserUpsertWithWhereUniqueWithoutLikedProductsInputSchema), z.lazy(() => UserUpsertWithWhereUniqueWithoutLikedProductsInputSchema).array() ]).optional(),
  set: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => UserWhereUniqueInputSchema), z.lazy(() => UserWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => UserUpdateWithWhereUniqueWithoutLikedProductsInputSchema), z.lazy(() => UserUpdateWithWhereUniqueWithoutLikedProductsInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => UserUpdateManyWithWhereWithoutLikedProductsInputSchema), z.lazy(() => UserUpdateManyWithWhereWithoutLikedProductsInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
});

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
});

export const NestedEnumUserTypeFilterSchema: z.ZodType<Prisma.NestedEnumUserTypeFilter> = z.strictObject({
  equals: z.lazy(() => UserTypeSchema).optional(),
  in: z.lazy(() => UserTypeSchema).array().optional(),
  notIn: z.lazy(() => UserTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => NestedEnumUserTypeFilterSchema) ]).optional(),
});

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
});

export const NestedDateTimeNullableFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional(),
});

export const NestedStringNullableFilterSchema: z.ZodType<Prisma.NestedStringNullableFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional(),
});

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional(),
  in: z.string().array().optional(),
  notIn: z.string().array().optional(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional(),
});

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.strictObject({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
});

export const NestedEnumUserTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumUserTypeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => UserTypeSchema).optional(),
  in: z.lazy(() => UserTypeSchema).array().optional(),
  notIn: z.lazy(() => UserTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => NestedEnumUserTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumUserTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumUserTypeFilterSchema).optional(),
});

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
});

export const NestedDateTimeNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeNullableWithAggregatesFilter> = z.strictObject({
  equals: z.coerce.date().optional().nullable(),
  in: z.coerce.date().array().optional().nullable(),
  notIn: z.coerce.date().array().optional().nullable(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeNullableFilterSchema).optional(),
  isSet: z.boolean().optional(),
});

export const NestedIntNullableFilterSchema: z.ZodType<Prisma.NestedIntNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional(),
});

export const NestedStringNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringNullableWithAggregatesFilter> = z.strictObject({
  equals: z.string().optional().nullable(),
  in: z.string().array().optional().nullable(),
  notIn: z.string().array().optional().nullable(),
  lt: z.string().optional(),
  lte: z.string().optional(),
  gt: z.string().optional(),
  gte: z.string().optional(),
  contains: z.string().optional(),
  startsWith: z.string().optional(),
  endsWith: z.string().optional(),
  not: z.union([ z.string(),z.lazy(() => NestedStringNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedStringNullableFilterSchema).optional(),
  isSet: z.boolean().optional(),
});

export const NestedFloatNullableFilterSchema: z.ZodType<Prisma.NestedFloatNullableFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableFilterSchema) ]).optional().nullable(),
  isSet: z.boolean().optional(),
});

export const NestedEnumProductTypeFilterSchema: z.ZodType<Prisma.NestedEnumProductTypeFilter> = z.strictObject({
  equals: z.lazy(() => ProductTypeSchema).optional(),
  in: z.lazy(() => ProductTypeSchema).array().optional(),
  notIn: z.lazy(() => ProductTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => NestedEnumProductTypeFilterSchema) ]).optional(),
});

export const NestedBoolFilterSchema: z.ZodType<Prisma.NestedBoolFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolFilterSchema) ]).optional(),
});

export const NestedFloatNullableWithAggregatesFilterSchema: z.ZodType<Prisma.NestedFloatNullableWithAggregatesFilter> = z.strictObject({
  equals: z.number().optional().nullable(),
  in: z.number().array().optional().nullable(),
  notIn: z.number().array().optional().nullable(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatNullableWithAggregatesFilterSchema) ]).optional().nullable(),
  _count: z.lazy(() => NestedIntNullableFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _sum: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _min: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  _max: z.lazy(() => NestedFloatNullableFilterSchema).optional(),
  isSet: z.boolean().optional(),
});

export const NestedEnumProductTypeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedEnumProductTypeWithAggregatesFilter> = z.strictObject({
  equals: z.lazy(() => ProductTypeSchema).optional(),
  in: z.lazy(() => ProductTypeSchema).array().optional(),
  notIn: z.lazy(() => ProductTypeSchema).array().optional(),
  not: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => NestedEnumProductTypeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedEnumProductTypeFilterSchema).optional(),
  _max: z.lazy(() => NestedEnumProductTypeFilterSchema).optional(),
});

export const NestedJsonFilterSchema: z.ZodType<Prisma.NestedJsonFilter> = z.strictObject({
  equals: InputJsonValueSchema.optional(),
  not: InputJsonValueSchema.optional(),
});

export const NestedBoolWithAggregatesFilterSchema: z.ZodType<Prisma.NestedBoolWithAggregatesFilter> = z.strictObject({
  equals: z.boolean().optional(),
  not: z.union([ z.boolean(),z.lazy(() => NestedBoolWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedBoolFilterSchema).optional(),
  _max: z.lazy(() => NestedBoolFilterSchema).optional(),
});

export const AuthTokenCreateWithoutUserInputSchema: z.ZodType<Prisma.AuthTokenCreateWithoutUserInput> = z.strictObject({
  id: z.string().optional(),
  token: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});

export const AuthTokenUncheckedCreateWithoutUserInputSchema: z.ZodType<Prisma.AuthTokenUncheckedCreateWithoutUserInput> = z.strictObject({
  id: z.string().optional(),
  token: z.string(),
  createdAt: z.coerce.date(),
  expiresAt: z.coerce.date(),
});

export const AuthTokenCreateOrConnectWithoutUserInputSchema: z.ZodType<Prisma.AuthTokenCreateOrConnectWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AuthTokenWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => AuthTokenCreateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedCreateWithoutUserInputSchema) ]),
});

export const ProductCreateWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductCreateWithoutLikedByUsersInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  price: z.number().optional().nullable(),
  type: z.lazy(() => ProductTypeSchema),
  data: InputJsonValueSchema,
  imageUrl: z.string(),
  imageName: z.string(),
  isReserved: z.boolean().optional(),
  reservedByUser: z.lazy(() => UserCreateNestedOneWithoutReservedProductsInputSchema).optional(),
});

export const ProductUncheckedCreateWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutLikedByUsersInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  price: z.number().optional().nullable(),
  type: z.lazy(() => ProductTypeSchema),
  data: InputJsonValueSchema,
  imageUrl: z.string(),
  imageName: z.string(),
  isReserved: z.boolean().optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductCreatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
  reservedByUserId: z.string().optional().nullable(),
});

export const ProductCreateOrConnectWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutLikedByUsersInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema) ]),
});

export const ProductCreateWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductCreateWithoutReservedByUserInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  price: z.number().optional().nullable(),
  type: z.lazy(() => ProductTypeSchema),
  data: InputJsonValueSchema,
  imageUrl: z.string(),
  imageName: z.string(),
  isReserved: z.boolean().optional(),
  likedByUsers: z.lazy(() => UserCreateNestedManyWithoutLikedProductsInputSchema).optional(),
});

export const ProductUncheckedCreateWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductUncheckedCreateWithoutReservedByUserInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  price: z.number().optional().nullable(),
  type: z.lazy(() => ProductTypeSchema),
  data: InputJsonValueSchema,
  imageUrl: z.string(),
  imageName: z.string(),
  isReserved: z.boolean().optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductCreatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
  likedByUsers: z.lazy(() => UserUncheckedCreateNestedManyWithoutLikedProductsInputSchema).optional(),
});

export const ProductCreateOrConnectWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductCreateOrConnectWithoutReservedByUserInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => ProductCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema) ]),
});

export const ProductCreateManyReservedByUserInputEnvelopeSchema: z.ZodType<Prisma.ProductCreateManyReservedByUserInputEnvelope> = z.strictObject({
  data: z.union([ z.lazy(() => ProductCreateManyReservedByUserInputSchema), z.lazy(() => ProductCreateManyReservedByUserInputSchema).array() ]),
});

export const AuthTokenUpsertWithoutUserInputSchema: z.ZodType<Prisma.AuthTokenUpsertWithoutUserInput> = z.strictObject({
  update: z.union([ z.lazy(() => AuthTokenUpdateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedUpdateWithoutUserInputSchema) ]),
  create: z.union([ z.lazy(() => AuthTokenCreateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedCreateWithoutUserInputSchema) ]),
  where: z.lazy(() => AuthTokenWhereInputSchema).optional(),
});

export const AuthTokenUpdateToOneWithWhereWithoutUserInputSchema: z.ZodType<Prisma.AuthTokenUpdateToOneWithWhereWithoutUserInput> = z.strictObject({
  where: z.lazy(() => AuthTokenWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => AuthTokenUpdateWithoutUserInputSchema), z.lazy(() => AuthTokenUncheckedUpdateWithoutUserInputSchema) ]),
});

export const AuthTokenUpdateWithoutUserInputSchema: z.ZodType<Prisma.AuthTokenUpdateWithoutUserInput> = z.strictObject({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const AuthTokenUncheckedUpdateWithoutUserInputSchema: z.ZodType<Prisma.AuthTokenUncheckedUpdateWithoutUserInput> = z.strictObject({
  token: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  expiresAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
});

export const ProductUpsertWithWhereUniqueWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutLikedByUsersInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductUpdateWithoutLikedByUsersInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutLikedByUsersInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutLikedByUsersInputSchema), z.lazy(() => ProductUncheckedCreateWithoutLikedByUsersInputSchema) ]),
});

export const ProductUpdateWithWhereUniqueWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutLikedByUsersInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateWithoutLikedByUsersInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutLikedByUsersInputSchema) ]),
});

export const ProductUpdateManyWithWhereWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutLikedByUsersInput> = z.strictObject({
  where: z.lazy(() => ProductScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateManyMutationInputSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutLikedByUsersInputSchema) ]),
});

export const ProductScalarWhereInputSchema: z.ZodType<Prisma.ProductScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => ProductScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => ProductScalarWhereInputSchema), z.lazy(() => ProductScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  price: z.union([ z.lazy(() => FloatNullableFilterSchema), z.number() ]).optional().nullable(),
  type: z.union([ z.lazy(() => EnumProductTypeFilterSchema), z.lazy(() => ProductTypeSchema) ]).optional(),
  data: z.lazy(() => JsonFilterSchema).optional(),
  imageUrl: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  imageName: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  isReserved: z.union([ z.lazy(() => BoolFilterSchema), z.boolean() ]).optional(),
  likedByUserIds: z.lazy(() => StringNullableListFilterSchema).optional(),
  reservedByUserId: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
});

export const ProductUpsertWithWhereUniqueWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductUpsertWithWhereUniqueWithoutReservedByUserInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => ProductUpdateWithoutReservedByUserInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutReservedByUserInputSchema) ]),
  create: z.union([ z.lazy(() => ProductCreateWithoutReservedByUserInputSchema), z.lazy(() => ProductUncheckedCreateWithoutReservedByUserInputSchema) ]),
});

export const ProductUpdateWithWhereUniqueWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductUpdateWithWhereUniqueWithoutReservedByUserInput> = z.strictObject({
  where: z.lazy(() => ProductWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateWithoutReservedByUserInputSchema), z.lazy(() => ProductUncheckedUpdateWithoutReservedByUserInputSchema) ]),
});

export const ProductUpdateManyWithWhereWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductUpdateManyWithWhereWithoutReservedByUserInput> = z.strictObject({
  where: z.lazy(() => ProductScalarWhereInputSchema),
  data: z.union([ z.lazy(() => ProductUpdateManyMutationInputSchema), z.lazy(() => ProductUncheckedUpdateManyWithoutReservedByUserInputSchema) ]),
});

export const UserCreateWithoutAuthTokenInputSchema: z.ZodType<Prisma.UserCreateWithoutAuthTokenInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => UserTypeSchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  likedProducts: z.lazy(() => ProductCreateNestedManyWithoutLikedByUsersInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductCreateNestedManyWithoutReservedByUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutAuthTokenInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutAuthTokenInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => UserTypeSchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserCreatelikedProductIdsInputSchema), z.string().array() ]).optional(),
  likedProducts: z.lazy(() => ProductUncheckedCreateNestedManyWithoutLikedByUsersInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductUncheckedCreateNestedManyWithoutReservedByUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutAuthTokenInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutAuthTokenInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutAuthTokenInputSchema), z.lazy(() => UserUncheckedCreateWithoutAuthTokenInputSchema) ]),
});

export const UserUpsertWithoutAuthTokenInputSchema: z.ZodType<Prisma.UserUpsertWithoutAuthTokenInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutAuthTokenInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAuthTokenInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutAuthTokenInputSchema), z.lazy(() => UserUncheckedCreateWithoutAuthTokenInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutAuthTokenInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutAuthTokenInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutAuthTokenInputSchema), z.lazy(() => UserUncheckedUpdateWithoutAuthTokenInputSchema) ]),
});

export const UserUpdateWithoutAuthTokenInputSchema: z.ZodType<Prisma.UserUpdateWithoutAuthTokenInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likedProducts: z.lazy(() => ProductUpdateManyWithoutLikedByUsersNestedInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductUpdateManyWithoutReservedByUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutAuthTokenInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutAuthTokenInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserUpdatelikedProductIdsInputSchema), z.string().array() ]).optional(),
  likedProducts: z.lazy(() => ProductUncheckedUpdateManyWithoutLikedByUsersNestedInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductUncheckedUpdateManyWithoutReservedByUserNestedInputSchema).optional(),
});

export const UserCreateWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserCreateWithoutLikedProductsInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => UserTypeSchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  authToken: z.lazy(() => AuthTokenCreateNestedOneWithoutUserInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductCreateNestedManyWithoutReservedByUserInputSchema).optional(),
});

export const UserUncheckedCreateWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutLikedProductsInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => UserTypeSchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserCreatelikedProductIdsInputSchema), z.string().array() ]).optional(),
  authToken: z.lazy(() => AuthTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductUncheckedCreateNestedManyWithoutReservedByUserInputSchema).optional(),
});

export const UserCreateOrConnectWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutLikedProductsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutLikedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema) ]),
});

export const UserCreateWithoutReservedProductsInputSchema: z.ZodType<Prisma.UserCreateWithoutReservedProductsInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => UserTypeSchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  authToken: z.lazy(() => AuthTokenCreateNestedOneWithoutUserInputSchema).optional(),
  likedProducts: z.lazy(() => ProductCreateNestedManyWithoutLikedByUsersInputSchema).optional(),
});

export const UserUncheckedCreateWithoutReservedProductsInputSchema: z.ZodType<Prisma.UserUncheckedCreateWithoutReservedProductsInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  email: z.string(),
  password: z.string(),
  role: z.lazy(() => UserTypeSchema).optional(),
  created_at: z.coerce.date().optional(),
  updated_at: z.coerce.date().optional().nullable(),
  phoneNumber: z.string().optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserCreatelikedProductIdsInputSchema), z.string().array() ]).optional(),
  authToken: z.lazy(() => AuthTokenUncheckedCreateNestedOneWithoutUserInputSchema).optional(),
  likedProducts: z.lazy(() => ProductUncheckedCreateNestedManyWithoutLikedByUsersInputSchema).optional(),
});

export const UserCreateOrConnectWithoutReservedProductsInputSchema: z.ZodType<Prisma.UserCreateOrConnectWithoutReservedProductsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => UserCreateWithoutReservedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutReservedProductsInputSchema) ]),
});

export const UserUpsertWithWhereUniqueWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserUpsertWithWhereUniqueWithoutLikedProductsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => UserUpdateWithoutLikedProductsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutLikedProductsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutLikedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutLikedProductsInputSchema) ]),
});

export const UserUpdateWithWhereUniqueWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserUpdateWithWhereUniqueWithoutLikedProductsInput> = z.strictObject({
  where: z.lazy(() => UserWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => UserUpdateWithoutLikedProductsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutLikedProductsInputSchema) ]),
});

export const UserUpdateManyWithWhereWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserUpdateManyWithWhereWithoutLikedProductsInput> = z.strictObject({
  where: z.lazy(() => UserScalarWhereInputSchema),
  data: z.union([ z.lazy(() => UserUpdateManyMutationInputSchema), z.lazy(() => UserUncheckedUpdateManyWithoutLikedProductsInputSchema) ]),
});

export const UserScalarWhereInputSchema: z.ZodType<Prisma.UserScalarWhereInput> = z.strictObject({
  AND: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => UserScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => UserScalarWhereInputSchema), z.lazy(() => UserScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  password: z.union([ z.lazy(() => StringFilterSchema), z.string() ]).optional(),
  role: z.union([ z.lazy(() => EnumUserTypeFilterSchema), z.lazy(() => UserTypeSchema) ]).optional(),
  created_at: z.union([ z.lazy(() => DateTimeFilterSchema), z.coerce.date() ]).optional(),
  updated_at: z.union([ z.lazy(() => DateTimeNullableFilterSchema), z.coerce.date() ]).optional().nullable(),
  phoneNumber: z.union([ z.lazy(() => StringNullableFilterSchema), z.string() ]).optional().nullable(),
  likedProductIds: z.lazy(() => StringNullableListFilterSchema).optional(),
});

export const UserUpsertWithoutReservedProductsInputSchema: z.ZodType<Prisma.UserUpsertWithoutReservedProductsInput> = z.strictObject({
  update: z.union([ z.lazy(() => UserUpdateWithoutReservedProductsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutReservedProductsInputSchema) ]),
  create: z.union([ z.lazy(() => UserCreateWithoutReservedProductsInputSchema), z.lazy(() => UserUncheckedCreateWithoutReservedProductsInputSchema) ]),
  where: z.lazy(() => UserWhereInputSchema).optional(),
});

export const UserUpdateToOneWithWhereWithoutReservedProductsInputSchema: z.ZodType<Prisma.UserUpdateToOneWithWhereWithoutReservedProductsInput> = z.strictObject({
  where: z.lazy(() => UserWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => UserUpdateWithoutReservedProductsInputSchema), z.lazy(() => UserUncheckedUpdateWithoutReservedProductsInputSchema) ]),
});

export const UserUpdateWithoutReservedProductsInputSchema: z.ZodType<Prisma.UserUpdateWithoutReservedProductsInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  authToken: z.lazy(() => AuthTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  likedProducts: z.lazy(() => ProductUpdateManyWithoutLikedByUsersNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutReservedProductsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutReservedProductsInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserUpdatelikedProductIdsInputSchema), z.string().array() ]).optional(),
  authToken: z.lazy(() => AuthTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  likedProducts: z.lazy(() => ProductUncheckedUpdateManyWithoutLikedByUsersNestedInputSchema).optional(),
});

export const ProductCreateManyReservedByUserInputSchema: z.ZodType<Prisma.ProductCreateManyReservedByUserInput> = z.strictObject({
  id: z.string().optional(),
  name: z.string(),
  price: z.number().optional().nullable(),
  type: z.lazy(() => ProductTypeSchema),
  data: InputJsonValueSchema,
  imageUrl: z.string(),
  imageName: z.string(),
  isReserved: z.boolean().optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductCreatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
});

export const ProductUpdateWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductUpdateWithoutLikedByUsersInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  reservedByUser: z.lazy(() => UserUpdateOneWithoutReservedProductsNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutLikedByUsersInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductUpdatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
  reservedByUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ProductUncheckedUpdateManyWithoutLikedByUsersInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutLikedByUsersInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductUpdatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
  reservedByUserId: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
});

export const ProductUpdateWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductUpdateWithoutReservedByUserInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  likedByUsers: z.lazy(() => UserUpdateManyWithoutLikedProductsNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateWithoutReservedByUserInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductUpdatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
  likedByUsers: z.lazy(() => UserUncheckedUpdateManyWithoutLikedProductsNestedInputSchema).optional(),
});

export const ProductUncheckedUpdateManyWithoutReservedByUserInputSchema: z.ZodType<Prisma.ProductUncheckedUpdateManyWithoutReservedByUserInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  price: z.union([ z.number(),z.lazy(() => NullableFloatFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  type: z.union([ z.lazy(() => ProductTypeSchema), z.lazy(() => EnumProductTypeFieldUpdateOperationsInputSchema) ]).optional(),
  data: z.union([ InputJsonValueSchema,InputJsonValueSchema ]).optional(),
  imageUrl: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  imageName: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  isReserved: z.union([ z.boolean(),z.lazy(() => BoolFieldUpdateOperationsInputSchema) ]).optional(),
  likedByUserIds: z.union([ z.lazy(() => ProductUpdatelikedByUserIdsInputSchema), z.string().array() ]).optional(),
});

export const UserUpdateWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserUpdateWithoutLikedProductsInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  authToken: z.lazy(() => AuthTokenUpdateOneWithoutUserNestedInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductUpdateManyWithoutReservedByUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateWithoutLikedProductsInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserUpdatelikedProductIdsInputSchema), z.string().array() ]).optional(),
  authToken: z.lazy(() => AuthTokenUncheckedUpdateOneWithoutUserNestedInputSchema).optional(),
  reservedProducts: z.lazy(() => ProductUncheckedUpdateManyWithoutReservedByUserNestedInputSchema).optional(),
});

export const UserUncheckedUpdateManyWithoutLikedProductsInputSchema: z.ZodType<Prisma.UserUncheckedUpdateManyWithoutLikedProductsInput> = z.strictObject({
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  password: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  role: z.union([ z.lazy(() => UserTypeSchema), z.lazy(() => EnumUserTypeFieldUpdateOperationsInputSchema) ]).optional(),
  created_at: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updated_at: z.union([ z.coerce.date(),z.lazy(() => NullableDateTimeFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  phoneNumber: z.union([ z.string(),z.lazy(() => NullableStringFieldUpdateOperationsInputSchema) ]).optional().nullable(),
  likedProductIds: z.union([ z.lazy(() => UserUpdatelikedProductIdsInputSchema), z.string().array() ]).optional(),
});

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const UserFindFirstArgsSchema: z.ZodType<Prisma.UserFindFirstArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindFirstOrThrowArgsSchema: z.ZodType<Prisma.UserFindFirstOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserFindManyArgsSchema: z.ZodType<Prisma.UserFindManyArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ UserScalarFieldEnumSchema, UserScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const UserAggregateArgsSchema: z.ZodType<Prisma.UserAggregateArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithRelationInputSchema.array(), UserOrderByWithRelationInputSchema ]).optional(),
  cursor: UserWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserGroupByArgsSchema: z.ZodType<Prisma.UserGroupByArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  orderBy: z.union([ UserOrderByWithAggregationInputSchema.array(), UserOrderByWithAggregationInputSchema ]).optional(),
  by: UserScalarFieldEnumSchema.array(), 
  having: UserScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const UserFindUniqueArgsSchema: z.ZodType<Prisma.UserFindUniqueArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.UserFindUniqueOrThrowArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const AuthTokenFindFirstArgsSchema: z.ZodType<Prisma.AuthTokenFindFirstArgs> = z.object({
  select: AuthTokenSelectSchema.optional(),
  include: AuthTokenIncludeSchema.optional(),
  where: AuthTokenWhereInputSchema.optional(), 
  orderBy: z.union([ AuthTokenOrderByWithRelationInputSchema.array(), AuthTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthTokenWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuthTokenScalarFieldEnumSchema, AuthTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AuthTokenFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AuthTokenFindFirstOrThrowArgs> = z.object({
  select: AuthTokenSelectSchema.optional(),
  include: AuthTokenIncludeSchema.optional(),
  where: AuthTokenWhereInputSchema.optional(), 
  orderBy: z.union([ AuthTokenOrderByWithRelationInputSchema.array(), AuthTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthTokenWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuthTokenScalarFieldEnumSchema, AuthTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AuthTokenFindManyArgsSchema: z.ZodType<Prisma.AuthTokenFindManyArgs> = z.object({
  select: AuthTokenSelectSchema.optional(),
  include: AuthTokenIncludeSchema.optional(),
  where: AuthTokenWhereInputSchema.optional(), 
  orderBy: z.union([ AuthTokenOrderByWithRelationInputSchema.array(), AuthTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthTokenWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AuthTokenScalarFieldEnumSchema, AuthTokenScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const AuthTokenAggregateArgsSchema: z.ZodType<Prisma.AuthTokenAggregateArgs> = z.object({
  where: AuthTokenWhereInputSchema.optional(), 
  orderBy: z.union([ AuthTokenOrderByWithRelationInputSchema.array(), AuthTokenOrderByWithRelationInputSchema ]).optional(),
  cursor: AuthTokenWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AuthTokenGroupByArgsSchema: z.ZodType<Prisma.AuthTokenGroupByArgs> = z.object({
  where: AuthTokenWhereInputSchema.optional(), 
  orderBy: z.union([ AuthTokenOrderByWithAggregationInputSchema.array(), AuthTokenOrderByWithAggregationInputSchema ]).optional(),
  by: AuthTokenScalarFieldEnumSchema.array(), 
  having: AuthTokenScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const AuthTokenFindUniqueArgsSchema: z.ZodType<Prisma.AuthTokenFindUniqueArgs> = z.object({
  select: AuthTokenSelectSchema.optional(),
  include: AuthTokenIncludeSchema.optional(),
  where: AuthTokenWhereUniqueInputSchema, 
}).strict();

export const AuthTokenFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AuthTokenFindUniqueOrThrowArgs> = z.object({
  select: AuthTokenSelectSchema.optional(),
  include: AuthTokenIncludeSchema.optional(),
  where: AuthTokenWhereUniqueInputSchema, 
}).strict();

export const ProductFindFirstArgsSchema: z.ZodType<Prisma.ProductFindFirstArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProductFindFirstOrThrowArgsSchema: z.ZodType<Prisma.ProductFindFirstOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProductFindManyArgsSchema: z.ZodType<Prisma.ProductFindManyArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ ProductScalarFieldEnumSchema, ProductScalarFieldEnumSchema.array() ]).optional(),
}).strict();

export const ProductAggregateArgsSchema: z.ZodType<Prisma.ProductAggregateArgs> = z.object({
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithRelationInputSchema.array(), ProductOrderByWithRelationInputSchema ]).optional(),
  cursor: ProductWhereUniqueInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProductGroupByArgsSchema: z.ZodType<Prisma.ProductGroupByArgs> = z.object({
  where: ProductWhereInputSchema.optional(), 
  orderBy: z.union([ ProductOrderByWithAggregationInputSchema.array(), ProductOrderByWithAggregationInputSchema ]).optional(),
  by: ProductScalarFieldEnumSchema.array(), 
  having: ProductScalarWhereWithAggregatesInputSchema.optional(), 
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict();

export const ProductFindUniqueArgsSchema: z.ZodType<Prisma.ProductFindUniqueArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const ProductFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.ProductFindUniqueOrThrowArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const UserCreateArgsSchema: z.ZodType<Prisma.UserCreateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
}).strict();

export const UserUpsertArgsSchema: z.ZodType<Prisma.UserUpsertArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
  create: z.union([ UserCreateInputSchema, UserUncheckedCreateInputSchema ]),
  update: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
}).strict();

export const UserCreateManyArgsSchema: z.ZodType<Prisma.UserCreateManyArgs> = z.object({
  data: z.union([ UserCreateManyInputSchema, UserCreateManyInputSchema.array() ]),
}).strict();

export const UserDeleteArgsSchema: z.ZodType<Prisma.UserDeleteArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateArgsSchema: z.ZodType<Prisma.UserUpdateArgs> = z.object({
  select: UserSelectSchema.optional(),
  include: UserIncludeSchema.optional(),
  data: z.union([ UserUpdateInputSchema, UserUncheckedUpdateInputSchema ]),
  where: UserWhereUniqueInputSchema, 
}).strict();

export const UserUpdateManyArgsSchema: z.ZodType<Prisma.UserUpdateManyArgs> = z.object({
  data: z.union([ UserUpdateManyMutationInputSchema, UserUncheckedUpdateManyInputSchema ]),
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const UserDeleteManyArgsSchema: z.ZodType<Prisma.UserDeleteManyArgs> = z.object({
  where: UserWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AuthTokenCreateArgsSchema: z.ZodType<Prisma.AuthTokenCreateArgs> = z.object({
  select: AuthTokenSelectSchema.optional(),
  include: AuthTokenIncludeSchema.optional(),
  data: z.union([ AuthTokenCreateInputSchema, AuthTokenUncheckedCreateInputSchema ]),
}).strict();

export const AuthTokenUpsertArgsSchema: z.ZodType<Prisma.AuthTokenUpsertArgs> = z.object({
  select: AuthTokenSelectSchema.optional(),
  include: AuthTokenIncludeSchema.optional(),
  where: AuthTokenWhereUniqueInputSchema, 
  create: z.union([ AuthTokenCreateInputSchema, AuthTokenUncheckedCreateInputSchema ]),
  update: z.union([ AuthTokenUpdateInputSchema, AuthTokenUncheckedUpdateInputSchema ]),
}).strict();

export const AuthTokenCreateManyArgsSchema: z.ZodType<Prisma.AuthTokenCreateManyArgs> = z.object({
  data: z.union([ AuthTokenCreateManyInputSchema, AuthTokenCreateManyInputSchema.array() ]),
}).strict();

export const AuthTokenDeleteArgsSchema: z.ZodType<Prisma.AuthTokenDeleteArgs> = z.object({
  select: AuthTokenSelectSchema.optional(),
  include: AuthTokenIncludeSchema.optional(),
  where: AuthTokenWhereUniqueInputSchema, 
}).strict();

export const AuthTokenUpdateArgsSchema: z.ZodType<Prisma.AuthTokenUpdateArgs> = z.object({
  select: AuthTokenSelectSchema.optional(),
  include: AuthTokenIncludeSchema.optional(),
  data: z.union([ AuthTokenUpdateInputSchema, AuthTokenUncheckedUpdateInputSchema ]),
  where: AuthTokenWhereUniqueInputSchema, 
}).strict();

export const AuthTokenUpdateManyArgsSchema: z.ZodType<Prisma.AuthTokenUpdateManyArgs> = z.object({
  data: z.union([ AuthTokenUpdateManyMutationInputSchema, AuthTokenUncheckedUpdateManyInputSchema ]),
  where: AuthTokenWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const AuthTokenDeleteManyArgsSchema: z.ZodType<Prisma.AuthTokenDeleteManyArgs> = z.object({
  where: AuthTokenWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProductCreateArgsSchema: z.ZodType<Prisma.ProductCreateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductCreateInputSchema, ProductUncheckedCreateInputSchema ]),
}).strict();

export const ProductUpsertArgsSchema: z.ZodType<Prisma.ProductUpsertArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema, 
  create: z.union([ ProductCreateInputSchema, ProductUncheckedCreateInputSchema ]),
  update: z.union([ ProductUpdateInputSchema, ProductUncheckedUpdateInputSchema ]),
}).strict();

export const ProductCreateManyArgsSchema: z.ZodType<Prisma.ProductCreateManyArgs> = z.object({
  data: z.union([ ProductCreateManyInputSchema, ProductCreateManyInputSchema.array() ]),
}).strict();

export const ProductDeleteArgsSchema: z.ZodType<Prisma.ProductDeleteArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const ProductUpdateArgsSchema: z.ZodType<Prisma.ProductUpdateArgs> = z.object({
  select: ProductSelectSchema.optional(),
  include: ProductIncludeSchema.optional(),
  data: z.union([ ProductUpdateInputSchema, ProductUncheckedUpdateInputSchema ]),
  where: ProductWhereUniqueInputSchema, 
}).strict();

export const ProductUpdateManyArgsSchema: z.ZodType<Prisma.ProductUpdateManyArgs> = z.object({
  data: z.union([ ProductUpdateManyMutationInputSchema, ProductUncheckedUpdateManyInputSchema ]),
  where: ProductWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();

export const ProductDeleteManyArgsSchema: z.ZodType<Prisma.ProductDeleteManyArgs> = z.object({
  where: ProductWhereInputSchema.optional(), 
  limit: z.number().optional(),
}).strict();