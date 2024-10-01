import '@testing-library/jest-dom/vitest';
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { HttpResponse, graphql, http } from 'msw'

const users = [
  {
    "id": 74,
    "name": "Blake",
    "email": "unknowinglyyy@gmail.com",
    "permissions": 3
  },
  {
    "id": 14,
    "name": "Shantanu Raghavan",
    "email": "sr613416@tamu.edu",
    "permissions": 2
  },
  {
    "id": 75,
    "name": "Shanty",
    "email": "UFOSHANTANU@GMAIL.COM",
    "permissions": 3
  },
  {
    "id": 15,
    "name": "Shantanu Raghavan",
    "email": "shantanuraghavan1@gmail.com",
    "permissions": 4
  },
  {
    "id": 1,
    "name": "Blake",
    "email": "dejohnblake@gmail.com",
    "permissions": 4
  },
  {
    "id": 6,
    "name": "Blake Dejohn",
    "email": "unknowingly@tamu.edu",
    "permissions": 4
  },
  {
    "id": 41,
    "name": "Nicholas Petersilge",
    "email": "nap2736@tamu.edu",
    "permissions": 4
  },
  {
    "id": 12,
    "name": "Dong Ha Cho",
    "email": "donghatamu@tamu.edu",
    "permissions": 4
  },
  {
    "id": 2,
    "name": "Samuel Bush",
    "email": "samuelkbush@tamu.edu",
    "permissions": 4
  }
]

export const restHandlers = [
  http.get('https://rev-pos-331.vercel.app/api/getUsers', () => {
    return HttpResponse.json(users)
  }),
]

const graphqlHandlers = [
  graphql.query('ListPosts', () => {
    return HttpResponse.json(
      {
        data: { users },
      },
    )
  }),
]

const server = setupServer(...restHandlers, ...graphqlHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())