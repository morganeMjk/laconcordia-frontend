const userStatus = [
    {
        id: 1,
        userId: 1,
        statusId: 1,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 2,
        userId: 1,
        statusId: 6,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 3,
        userId: 1,
        statusId: 9,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 4,
        userId: 2,
        statusId: 6,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 5,
        userId: 2,
        statusId: 2,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 6,
        userId: 2,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 7,
        userId: 3,
        statusId: 3,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 8,
        userId: 3,
        statusId: 11,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 9,
        userId: 3,
        statusId: 12,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 10,
        userId: 4,
        statusId: 3,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 11,
        userId: 4,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 12,
        userId: 4,
        statusId: 10,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 13,
        userId: 5,
        statusId: 3,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 14,
        userId: 6,
        statusId: 3,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 15,
        userId: 6,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 16,
        userId: 6,
        statusId: 12,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 17,
        userId: 7,
        statusId: 2,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 18,
        userId: 7,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 19,
        userId: 8,
        statusId: 5,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 20,
        userId: 8,
        statusId: 2,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 21,
        userId: 9,
        statusId: 6,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 22,
        userId: 9,
        statusId: 12,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 23,
        userId: 9,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 24,
        userId: 10,
        statusId: 7,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 25,
        userId: 10,
        statusId: 11,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 26,
        userId: 10,
        statusId: 12,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 27,
        userId: 11,
        statusId: 8,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 28,
        userId: 11,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 29,
        userId: 12,
        statusId: 8,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 30,
        userId: 12,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 31,
        userId: 13,
        statusId: 8,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 32,
        userId: 13,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 33,
        userId: 14,
        statusId: 8,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 34,
        userId: 14,
        statusId: 12,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 35,
        userId: 14,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 36,
        userId: 15,
        statusId: 11,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 37,
        userId: 15,
        statusId: 12,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 38,
        userId: 16,
        statusId: 11,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 39,
        userId: 16,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 40,
        userId: 17,
        statusId: 10,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 41,
        userId: 17,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 42,
        userId: 18,
        statusId: 10,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 43,
        userId: 18,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 44,
        userId: 19,
        statusId: 13,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 45,
        userId: 20,
        statusId: 12,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
    {
        id: 46,
        userId: 20,
        statusId: 4,
        createdAt: '2020-01-01',
        updatedAt: '2020-01-01'
    },
]

export default userStatus;