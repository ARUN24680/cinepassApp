import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const client = new pg.Client({
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

const moviesToSeed = [
    {
        id: 1,
        title: 'Dune: Part Two',
        rating: '4.9',
        genre: 'Sci-Fi/Action',
        duration_mins: 166,
        release_date: 'Mar 1, 2024',
        description: 'Paul Atreides unites with Chani and the Fremen while on a warpath of revenge against the conspirators who destroyed his family.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAVqX6733YMhMr5rCwF3Ak12nTTYuXPC4NHALyRdWzM2Mhoa4THSDe0LD1h1VBp3AX_C2-n0ao5VxGviwBKexDb0JrFJZ0TfUFwwB0_Dub-Os56rM-cftrWcMbyyKn-h05OpEQpxQ6CyJqcvTslIfIi5xLP1tkWT1futE9PSjIIrs9ycD3pgEuzrNAmJ47AX_s5etJtunmqf46FN3Xz3bpP9N0j27NgWIT-PqHbToeV_DQ2ZA5f0_IURaN4ELL0Q0EZkgv8BVbGdQ',
        backdrop: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBUfdu726nlXL3igTrToCJucBYpFFMclQ373LDog2__oWTBSghyBsf2LpFSYyrFVbEG8aZK8OzfCszXy9BgGdpW7917wop-pWUL8X3mRhrB3ZdtMtWky4kGjjvZ-23xU_mcs76tWgb1fbYQv5DJgpxHaO3irsMluEBAegNk4EYNXK17hnv67Zq9pObtCCjEwVpI4mgy5ikgVNhfvAtkPu-s-S_NWm_st6VAoOCozj52ChzPerXU1q_u4_Q5oIGksS1vA0QHAJ0TfA', // Dune Backdrop
        poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUGbdggtrC7XiGuOT2rbIXly9woeehnlr0lS67mf-5HIWqZDkjTw8rEiJDztGKfgXZzgh87kdOawnHCR3w0o_5CrpWW7zMzBsU2S5893DzOg8Y8PAIGTGmwb3Hib8bueuTXtubkJih9Zks7tDLaJt9LW4pLq89Q9DhlmFOtOymrGEGVFenv6Val3b3duehqK_V_9lf1e9x2_m_bWDFIYdhWdnTBjyvkWnmukAhMXqdCcZTeSGkHm9_JyCWkzPHHCSYft-yl7PeTw',
        cast: [
            { name: 'Timothée Chalamet', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjj3HeK929GtqyX-k5KM1WhqcbZ3Kd_r7rxK1ar6R7PzCWUnnIGC_qzClj7BDD1LlLZcrVhSH0UEWCtTzcikACe-9gSwGMgfgAMqW8j0gsL40GlJWCSA8X6bEu6qSJu6ruoN-anR2vq2C27l-dWZ8hdMLF4jX8bhCc8r4oJ4YGof1bZFUJorWY9uChG2BJPJpE1KjeQX0epzvyrsbBV4pzRifp68WoKKR-IPr87v7Gf6Wc6GMVUfKPUTusK0naokQk3fSx-Wn4qA' },
            { name: 'Zendaya', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlVVXpV6FSkU_6akBBOcQIXwnVryy4Arxy6dX-QEB_IaLmYEuvxqbPYQ5wWJ71qiYlHkzZJO--fbIpx1Hs3d9IGUnUPyuCbO41n5aVhihOsc6m8OZQck1pGhwmFxEk8X5x5f2qnmsZn39M8EI9smOn_CDMFSZsUJNhbKprwElZk9xhnVkn8lz8YmdOHkaiQ-wBz7ljzWvDK0fm20RPwePFJhfN0QhM3JlW-Bdm2lGWQxpzoAvLBS8UGzy4u3kpmpnto8IPHdZfBg' },
            { name: 'Austin Butler', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFgQit6sCnNFTeymgpUikujfhbkl0vxWsSROeQrPQ1c7uZasC5a907g8W5voYWJcLUMlFPN8cCiGYSoaHrIvROYQ4QbJRaEg1aoOl_K0ifYU4rG4rf2ZOcSEF-JD9QQ_RGoNIS5hFpcxGBk9vyykA6zs8Q93T3_TJud3t9K4GjpCsQ6Nm6LwNraOyJQ9nsQi4QlmM3j4yKdA-2Joou2ofAX2jkOs6zXndZm2oaJmHPRHPN6cw3lg0jixGHr9TUP3MrzbFAVFeyuQ' }
        ]
    },
    {
        id: 2,
        title: 'Neon Nights',
        rating: '4.5',
        genre: 'Thriller',
        duration_mins: 112,
        release_date: 'Apr 12, 2024',
        description: 'A detective is drawn into the neon-lit underworld of a futuristic city while investigating the mysterious disappearance of a tech billionaire.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEHW2G6hgkaS6CduVJV5yNtV0ViPzs-hsodN6jWyYdyZOyPN7nXiG-3fDGhBCFms_vVPxJ-PLvRVbihf9b45fK07dZHqRv3fJDz1c1gFhKA1271SUUC8cApS6Y_An24kuWhq6jOyZFXiQHOhV8VjMUNkGDspW1Ez2xMZC1AZkHiNQqhVg8zHcRfHGNwUUaFBWGJ5Q6fpFZvfAs2zTNPRnXDaV7CfcN7kAle1_IOQ6Yj9Rje733yNl6RMKOi8PX6yG5dP7bgLBzIQ',
        backdrop: 'https://lh3.googleusercontent.com/aida-public/AB6AXuARTddp6O66evKDlPg2KDis6ZAV_0TUXrBpCXMtDyOmt1RRSLOJfK8dJ86dExugDUe42SurJ0GthfFci1G6j7MC3XYg1LyDqO1xmD2FpmL3-vkzAfa_2Kc5W6LC7aOFYxvIl-sgonWvz80ISCF-8ho4ysV4c9w_yR-hTX2kn0bmabzU8WiLwM_sx816t-NZI_4vBvine7QpYqlOkYZ88i_O9Ya4LD9pFxvK9iMo4cmUcsY1NnCIeqOwwVFberXFhaNjb0htgbbXMg', // Distinct Backdrop
        poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAEHW2G6hgkaS6CduVJV5yNtV0ViPzs-hsodN6jWyYdyZOyPN7nXiG-3fDGhBCFms_vVPxJ-PLvRVbihf9b45fK07dZHqRv3fJDz1c1gFhKA1271SUUC8cApS6Y_An24kuWhq6jOyZFXiQHOhV8VjMUNkGDspW1Ez2xMZC1AZkHiNQqhVg8zHcRfHGNwUUaFBWGJ5Q6fpFZvfAs2zTNPRnXDaV7CfcN7kAle1_IOQ6Yj9Rje733yNl6RMKOi8PX6yG5dP7bgLBzIQ',
        cast: [
            { name: 'Austin Butler', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFgQit6sCnNFTeymgpUikujfhbkl0vxWsSROeQrPQ1c7uZasC5a907g8W5voYWJcLUMlFPN8cCiGYSoaHrIvROYQ4QbJRaEg1aoOl_K0ifYU4rG4rf2ZOcSEF-JD9QQ_RGoNIS5hFpcxGBk9vyykA6zs8Q93T3_TJud3t9K4GjpCsQ6Nm6LwNraOyJQ9nsQi4QlmM3j4yKdA-2Joou2ofAX2jkOs6zXndZm2oaJmHPRHPN6cw3lg0jixGHr9TUP3MrzbFAVFeyuQ' },
            { name: 'Florence Pugh', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD93-oFtC9xsmj5xvHz5lhZV8siaB-01mK52kwMseHmRDuScrxSQrSGfhMUd2586gMa-gvwHCPerJ-9gBnEx__-vzaAUD9sQuLE9hqA1YuZ7VIixtxCo-9nt_P8amSUcSJqYdkP3edd8cb3vEKe85LXBKG-gzzoVjVQnc5rwu5L3UbFOjgDdCkkcm_KlE0SKnbuIfr2MyFcHRuzJ7PgevI0maCiv3z9ml3JTbGiBqpCfJjXL7s9IIdn3IgfZ1sCQep48H7lrZzNZQ' },
            { name: 'Zendaya', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlVVXpV6FSkU_6akBBOcQIXwnVryy4Arxy6dX-QEB_IaLmYEuvxqbPYQ5wWJ71qiYlHkzZJO--fbIpx1Hs3d9IGUnUPyuCbO41n5aVhihOsc6m8OZQck1pGhwmFxEk8X5x5f2qnmsZn39M8EI9smOn_CDMFSZsUJNhbKprwElZk9xhnVkn8lz8YmdOHkaiQ-wBz7ljzWvDK0fm20RPwePFJhfN0QhM3JlW-Bdm2lGWQxpzoAvLBS8UGzy4u3kpmpnto8IPHdZfBg' }
        ]
    },
    {
        id: 3,
        title: 'Kingdom of Clouds',
        rating: '4.7',
        genre: 'Fantasy',
        duration_mins: 145,
        release_date: 'May 10, 2024',
        description: 'In a world above the sky, a young cartographer discovers a hidden floating kingdom and must protect it from a tyrannical conqueror.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd5_692HwzRdLycQai0sDFyCH8aHyDm9sbN08fVW_1u3BsBemnUBqtp00JeYE75a_c09_mM-wk3ZbB0EXDHP2lTU5gsolF96ibRXFuVYQCj7TBWDx2s65ud1W8go3Lq5cOysNeBCm2cw8AqWmWV-0VGn-ZPfVHqFnRJVzb5nGD6d1T6vL2tiPM4J7Az91l07GOZu10iQsXUS4dlKlWd8CFFHsHKde1b8XCdkSinAv38x68ocm2H4rew8aWIruWMsfoC3PeBKBITw',
        backdrop: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBKkEDxAZQFU9fMo5FCaQjxXvw09tRzxerbUmx7uLE_yAxKOYxaGUmuprCNjo7eVVIVo2E_l-ZnT6Kx0JlbUqkFWWOrqtlE6RwnA6If6VsA6zLFe_-sx-Pz0mxxmFvdn4B4osbKAXEdUJY2jO6fpJxjLXXn1ySHMQAeFOY1J2qcC7yEyC19SM6brrEalWL5wxXOBfFoCK6f7AAoIvosc_ajvpVl49bmLWAxMO4irHfdzplK628ccFg_aR8w1V6YOZ_AOb6y9lIepA', // Distinct Backdrop
        poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCd5_692HwzRdLycQai0sDFyCH8aHyDm9sbN08fVW_1u3BsBemnUBqtp00JeYE75a_c09_mM-wk3ZbB0EXDHP2lTU5gsolF96ibRXFuVYQCj7TBWDx2s65ud1W8go3Lq5cOysNeBCm2cw8AqWmWV-0VGn-ZPfVHqFnRJVzb5nGD6d1T6vL2tiPM4J7Az91l07GOZu10iQsXUS4dlKlWd8CFFHsHKde1b8XCdkSinAv38x68ocm2H4rew8aWIruWMsfoC3PeBKBITw',
        cast: [
            { name: 'Florence Pugh', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD93-oFtC9xsmj5xvHz5lhZV8siaB-01mK52kwMseHmRDuScrxSQrSGfhMUd2586gMa-gvwHCPerJ-9gBnEx__-vzaAUD9sQuLE9hqA1YuZ7VIixtxCo-9nt_P8amSUcSJqYdkP3edd8cb3vEKe85LXBKG-gzzoVjVQnc5rwu5L3UbFOjgDdCkkcm_KlE0SKnbuIfr2MyFcHRuzJ7PgevI0maCiv3z9ml3JTbGiBqpCfJjXL7s9IIdn3IgfZ1sCQep48H7lrZzNZQ' },
            { name: 'Zendaya', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlVVXpV6FSkU_6akBBOcQIXwnVryy4Arxy6dX-QEB_IaLmYEuvxqbPYQ5wWJ71qiYlHkzZJO--fbIpx1Hs3d9IGUnUPyuCbO41n5aVhihOsc6m8OZQck1pGhwmFxEk8X5x5f2qnmsZn39M8EI9smOn_CDMFSZsUJNhbKprwElZk9xhnVkn8lz8YmdOHkaiQ-wBz7ljzWvDK0fm20RPwePFJhfN0QhM3JlW-Bdm2lGWQxpzoAvLBS8UGzy4u3kpmpnto8IPHdZfBg' },
            { name: 'Timothée Chalamet', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjj3HeK929GtqyX-k5KM1WhqcbZ3Kd_r7rxK1ar6R7PzCWUnnIGC_qzClj7BDD1LlLZcrVhSH0UEWCtTzcikACe-9gSwGMgfgAMqW8j0gsL40GlJWCSA8X6bEu6qSJu6ruoN-anR2vq2C27l-dWZ8hdMLF4jX8bhCc8r4oJ4YGof1bZFUJorWY9uChG2BJPJpE1KjeQX0epzvyrsbBV4pzRifp68WoKKR-IPr87v7Gf6Wc6GMVUfKPUTusK0naokQk3fSx-Wn4qA' },
            { name: 'Visitor User', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDIujvT5yuDEM7cObHXiN3oN9voe5dz67_sb5Nqu3ykCqaoMamzB-hxcMe4EanKvWrhZJdeuMkuqYQEXsQw7htSYkwf4YRQtE_pUgtzqvNaHVqU22oIJ5M5lW4pkffmwge76jMIZiYGCfh_7rLZwo4Df56mybh9PbQspq2eY93TNvckZf_BuDNccaaxpDgkjO__VCbaVXaAQXybt7rMk6lgZh2AK_e-El6AqR1yBrZh01U8xmVTRn1R9EX8Zd4QHtJJoDwgsEip9w' }
        ]
    },
    {
        id: 4,
        title: 'Shards of Memory',
        rating: '4.2',
        genre: 'Drama',
        duration_mins: 98,
        release_date: 'Jun 7, 2024',
        description: 'An aging pianist struggles with early-onset dementia, embarking on a final emotional journey to piece together his scattered memories with his daughter.',
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACVS9UZ1KQMHGvM-1eoN7U9Gh1UVAy9BisQ2M08CJEfGD8vvhuuqDvLC3FICmAqsRo4X8Lj4b7jbfAYLkC7V1BSexGlXXVkZMrWNP2uSM6ewEEWKiHJ6l8gX5jvEgtk5_9Y7xDq6hfCmNaec2QLgA7MufCP-H2y2URA_SD4hG5kdF1DenX4j_MM6lCQaGdv_rJq9jYRNiQkx9LQU4_Li3H8SWJDEFlwSGcfBhWXd2f1BLIhE9J2anvGMcV8T_xmV4fI8m0wEluQw',
        backdrop: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDhdn8fnF_oATmxT_WAoawHrskrlY2m-B3fPrHFa3eUoLoT_C8Lu_yVDWhTgMCGVTOUtsCDU20gso3kbZAzgNkcdFOtaBc74jPov5dQ-4S81v5KNfejOg8bk5mHHOn8pmMCECNdnIpqUZFMeW8FFyP3KXMkA4Sqn6kQ9WVwXdXyxr6cmfoHnbBrj2Y0GKCGtNAr1o3NAGHWWAduoX3iO9qn59XL2N1TvJgtgx2rKLGC39Kok-vzcmikJLEV_Qao0r1Q04Naia19hg', // Distinct Backdrop
        poster: 'https://lh3.googleusercontent.com/aida-public/AB6AXuACVS9UZ1KQMHGvM-1eoN7U9Gh1UVAy9BisQ2M08CJEfGD8vvhuuqDvLC3FICmAqsRo4X8Lj4b7jbfAYLkC7V1BSexGlXXVkZMrWNP2uSM6ewEEWKiHJ6l8gX5jvEgtk5_9Y7xDq6hfCmNaec2QLgA7MufCP-H2y2URA_SD4hG5kdF1DenX4j_MM6lCQaGdv_rJq9jYRNiQkx9LQU4_Li3H8SWJDEFlwSGcfBhWXd2f1BLIhE9J2anvGMcV8T_xmV4fI8m0wEluQw',
        cast: [
            { name: 'Timothée Chalamet', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDjj3HeK929GtqyX-k5KM1WhqcbZ3Kd_r7rxK1ar6R7PzCWUnnIGC_qzClj7BDD1LlLZcrVhSH0UEWCtTzcikACe-9gSwGMgfgAMqW8j0gsL40GlJWCSA8X6bEu6qSJu6ruoN-anR2vq2C27l-dWZ8hdMLF4jX8bhCc8r4oJ4YGof1bZFUJorWY9uChG2BJPJpE1KjeQX0epzvyrsbBV4pzRifp68WoKKR-IPr87v7Gf6Wc6GMVUfKPUTusK0naokQk3fSx-Wn4qA' },
            { name: 'Austin Butler', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAFgQit6sCnNFTeymgpUikujfhbkl0vxWsSROeQrPQ1c7uZasC5a907g8W5voYWJcLUMlFPN8cCiGYSoaHrIvROYQ4QbJRaEg1aoOl_K0ifYU4rG4rf2ZOcSEF-JD9QQ_RGoNIS5hFpcxGBk9vyykA6zs8Q93T3_TJud3t9K4GjpCsQ6Nm6LwNraOyJQ9nsQi4QlmM3j4yKdA-2Joou2ofAX2jkOs6zXndZm2oaJmHPRHPN6cw3lg0jixGHr9TUP3MrzbFAVFeyuQ' },
            { name: 'Florence Pugh', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD93-oFtC9xsmj5xvHz5lhZV8siaB-01mK52kwMseHmRDuScrxSQrSGfhMUd2586gMa-gvwHCPerJ-9gBnEx__-vzaAUD9sQuLE9hqA1YuZ7VIixtxCo-9nt_P8amSUcSJqYdkP3edd8cb3vEKe85LXBKG-gzzoVjVQnc5rwu5L3UbFOjgDdCkkcm_KlE0SKnbuIfr2MyFcHRuzJ7PgevI0maCiv3z9ml3JTbGiBqpCfJjXL7s9IIdn3IgfZ1sCQep48H7lrZzNZQ' }
        ]
    }
];


const moviesTimesToSeed = [

    { id: 1, time: '14:30', format: 'IMAX 4K', status: 'available' },
    { id: 2, time: '18:00', format: 'IMAX 4K', status: 'available' },
    { id: 3, time: '15:00', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 4, time: '19:30', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 5, time: '22:45', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 6, time: '10:00', format: 'Standard', status: 'available' },
    { id: 7, time: '13:15', format: 'Standard', status: 'available' },
    { id: 8, time: '16:45', format: 'Standard', status: 'available' },

    { id: 9, time: '14:30', format: 'IMAX 4K', status: 'available' },
    { id: 10, time: '18:00', format: 'IMAX 4K', status: 'available' },
    { id: 11, time: '21:15', format: 'IMAX 4K', status: 'available' },
    { id: 12, time: '15:00', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 13, time: '22:45', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 14, time: '10:00', format: 'Standard', status: 'available' },
    { id: 15, time: '13:15', format: 'Standard', status: 'available' },
    { id: 16, time: '20:00', format: 'Standard', status: 'available' },
    { id: 17, time: '23:15', format: 'Standard', status: 'available' },

    { id: 18, time: '14:30', format: 'IMAX 4K', status: 'available' },
    { id: 19, time: '18:00', format: 'IMAX 4K', status: 'available' },
    { id: 20, time: '21:15', format: 'IMAX 4K', status: 'available' },
    { id: 21, time: '15:00', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 22, time: '19:30', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 23, time: '22:45', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 24, time: '10:00', format: 'Standard', status: 'available' },
    { id: 25, time: '13:15', format: 'Standard', status: 'available' },
    { id: 26, time: '16:45', format: 'Standard', status: 'available' },

    { id: 27, time: '14:30', format: 'IMAX 4K', status: 'available' },
    { id: 28, time: '18:00', format: 'IMAX 4K', status: 'available' },
    { id: 29, time: '21:15', format: 'IMAX 4K', status: 'available' },
    { id: 30, time: '15:00', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 31, time: '19:30', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 32, time: '22:45', format: 'Dolby Cinema', status: 'sold_out' },
    { id: 33, time: '10:00', format: 'Standard', status: 'available' },
    { id: 34, time: '13:15', format: 'Standard', status: 'available' },
    { id: 35, time: '16:45', format: 'Standard', status: 'available' },
    { id: 36, time: '20:00', format: 'Standard', status: 'available' },
    { id: 37, time: '23:15', format: 'Standard', status: 'available' },
];

const seed = async () => {
    try {
        await client.connect();

        // 1. Clear old entries and reset IDs
        await client.query('TRUNCATE TABLE movies RESTART IDENTITY CASCADE');
        await client.query('TRUNCATE TABLE movies_times RESTART IDENTITY CASCADE');
        await client.query('TRUNCATE TABLE show_seats RESTART IDENTITY CASCADE');


        // 2. Insert movies
        for (const movie of moviesToSeed) {
            const sql = `
        INSERT INTO movies (id, title, rating, genre, duration_mins, release_date, description, image, backdrop, poster, "cast")
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        `;
            await client.query(sql, [movie.id, movie.title, movie.rating, movie.genre, movie.duration_mins, movie.release_date, movie.description, movie.image, movie.backdrop, movie.poster, JSON.stringify(movie.cast)]);
        }

        for (const movie of moviesTimesToSeed) {
            const sql = `
        INSERT INTO movies_times (id, movie_id, time, format, status)
        VALUES ($1, $2, $3, $4, $5)
        `;
            let movie_id = 1;
            if (movie.id >= 1 && movie.id <= 8) movie_id = 1;
            else if (movie.id >= 9 && movie.id <= 17) movie_id = 2;
            else if (movie.id >= 18 && movie.id <= 26) movie_id = 3;
            else movie_id = 4;

            await client.query(sql, [movie.id, movie_id, movie.time, movie.format, movie.status]);
        }

        // 3. Seeding show seats for all movie times (10 rows x 14 seats = 140 seats per showtime)
        const ROWS = ['J', 'I', 'H', 'G', 'F', 'E', 'D', 'C', 'B', 'A'];
        const SEATS_PER_ROW = 14;
        const MOCK_BOOKED = [12, 13, 24, 25, 45, 46, 78, 79, 110, 111];
        const MOCK_LOCKED = [34, 56, 89];

        console.log('⏳ Seeding show seats...');
        // Seed exactly 140 seats for the first show time slot (ID 45)
        const targetShowTime = moviesTimesToSeed[0]; // ID 45
        let globalId = 1;
        for (const row of ROWS) {
            for (let col = 1; col <= SEATS_PER_ROW; col++) {
                let status = 'available';
                if (MOCK_BOOKED.includes(globalId)) status = 'booked';
                else if (MOCK_LOCKED.includes(globalId)) status = 'locked';

                const type = row === 'A' || row === 'B' ? 'premium' : 'standard';

                const sql = `
                    INSERT INTO show_seats (col_num, row_num, seat_id, movie_id, show_seat_id, status, type)
                    VALUES ($1, $2, $3, $4, $5, $6, $7)
                `;
                await client.query(sql, [col, row, globalId, 1, targetShowTime.id, status, type]);
                globalId++;
            }
        }
        console.log('✅ show seats seeded');

        console.log('🎉 Seeding completed successfully!');
    } catch (err) {
        console.error('❌ Seeding failed:', err.message);
    } finally {
        await client.end(); // ⬅️ Close connection
    }
};

seed();
