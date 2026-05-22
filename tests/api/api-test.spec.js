import { test, expect } from '@playwright/test';
const { z } = require("zod");

export const RootSchema = z.object({
  data: z.array(z.union([
    z.object({
      id: z.number().int(),
      post: z.object({
        id: z.number().int(),
      }),
      type: z.string(),
      liked: z.boolean(),
      text: z.string(),
      employee: z.object({
        empNumber: z.number().int(),
        lastName: z.string(),
        firstName: z.string(),
        middleName: z.string(),
        employeeId: z.string(),
        terminationId: z.unknown().nullable(),
      }),
      stats: z.object({
        numOfLikes: z.number().int(),
        numOfComments: z.number().int(),
        numOfShares: z.number().int(),
      }),
      createdDate: z.string(),
      createdTime: z.string(),
      originalPost: z.unknown().nullable(),
      permission: z.object({
        canUpdate: z.boolean(),
        canDelete: z.boolean(),
      }),
    }),
    z.object({
      id: z.number().int(),
      post: z.object({
        id: z.number().int(),
      }),
      type: z.string(),
      liked: z.boolean(),
      text: z.string(),
      employee: z.object({
        empNumber: z.number().int(),
        lastName: z.string(),
        firstName: z.string(),
        middleName: z.string(),
        employeeId: z.string(),
        terminationId: z.unknown().nullable(),
      }),
      stats: z.object({
        numOfLikes: z.number().int(),
        numOfComments: z.number().int(),
        numOfShares: z.number().int(),
      }),
      createdDate: z.string(),
      createdTime: z.string(),
      originalPost: z.unknown().nullable(),
      permission: z.object({
        canUpdate: z.boolean(),
        canDelete: z.boolean(),
      }),
      photoIds: z.array(z.number().int()),
    }),
  ])),
  meta: z.object({
    total: z.number().int(),
  }),
  rels: z.array(z.unknown()),
})




test('Admin login via api', {
    tag: '@login-test-api'
}, async ({ request }) => {

    const base_url= "https://opensource-demo.orangehrmlive.com"

    const response = await request.get(
        base_url+'/web/index.php/auth/login'
    );

    expect(response.status()).toBe(200)

    const html = await response.text();
    const match = html.match(/:token="&quot;([^"]+)&quot;"/);
    const token = match?.[1];

    const login = await request.post(
        base_url+'/web/index.php/auth/validate',
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            form: {
                _token: token,
                username: 'Admin',
                password: 'admin123'
            }
        }
    );

    expect(login.status()).toBe(200)

    const profile_data = await request.get(
        base_url+"/web/index.php/api/v2/buzz/feed?limit=5&offset=0&sortOrder=DESC&sortField=share.createdAtUtc"
    )

    const body = await profile_data.json();

    const result = RootSchema.safeParse(body);

    console.log(body)

    expect(body.data).toBeDefined();


});


