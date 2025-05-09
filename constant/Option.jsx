export const PraticeOption = [
    {
        name: 'Quiz',
        image: require('./../assets/images/quizz.png'),
        icon: require('./../assets/images/quiz.png'),
        path: '/quiz'
    },
    {
        name: 'Flashcards',
        image: require('./../assets/images/flashcard.png'),
        icon: require('./../assets/images/layers.png'),
        path: '/flashcards'

    },
    {
        name: 'Question & Ans',
        image: require('./../assets/images/notes.png'),
        icon: require('./../assets/images/qa.png'),
        path: '/questionAnswer'

    }
]

export const imageAssets = {
    '/banner1.png': require('./../assets/images/banner1.png'),
    '/banner2.png': require('./../assets/images/banner2.png'),
    '/banner3.png': require('./../assets/images/banner3.png'),
    '/banner4.png': require('./../assets/images/banner4.png'),
    '/banner5.png': require('./../assets/images/banner5.png'),
    '/banner6.png': require('./../assets/images/banner6.png'),

};

export const CourseCategory = ["Tech & Coding", "Business & Finance", "Health & Fitness", "Science & Engineering", "Arts & Creativity"]

export const ProfileMenu = [
    {
        name: 'Add Course',
        icon: 'add-outline', //Ionic Icons 
        path: '/addCourse'
    },
    {
        name: 'My Course',
        icon: 'book', //Ionic Icons 
        path: '/(tabs)/Home'
    },
    {
        name: "Explore",
        icon: "search-outline",
        path: "/(tabs)/Explore"

    },
    {
        name: 'Course Progress',
        icon: 'analytics-outline', //Ionic Icons 
        path: '/(tabs)/Progress'
    },
    {
        name: "Feedback",
        "icon": "chatbubble-ellipses-outline",
        "path": "/feedback"
    },
    {
        name: 'Logout',
        icon: 'log-out', //Ionic Icons 
    }
]