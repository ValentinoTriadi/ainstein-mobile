export interface Comment {
	id: string;
	userName: string;
	text: string;
	replies?: Comment[];
}

export interface Video {
	id: string;
	title: string;
	videoUrl: string;
	uploaderName: string;
	uploaderAvatar: string;
	likesCount: number;
	isLiked: boolean;
	comments: Comment[];
}

export interface ChatMessage {
	id: string;
	speaker: "user" | "ai";
	messageText: string;
	timestamp: string;
}

export interface ChatConversation {
	studyKitId: string;
	studyKitTitle: string;
	lastMessagePreview: string;
	lastMessageTimestamp: string;
	messages: ChatMessage[];
}

export interface Asset {
	id: string;
	type: "video" | "quiz" | "flashcard";
	title: string;
	videoUrl?: string;
	questionCount?: number;
	flashcardCount?: number;
}

export interface StudyKit {
	id: string;
	title: string;
	description: string;
	imageUrl: string;
	assets: Asset[];
}

export interface StudyKitGroup {
	id: string;
	name: string;
	studyKitIds: string[];
}

export interface UserProfile {
	id: string;
	username: string;
	email: string;
	profilePicture: string;
}

// Dummy Videos Data
export const dummyVideos: Video[] = [
	{
		id: "1",
		title: "Introduction to Quantum Physics",
		videoUrl: "https://www.example.com/video1.mp4",
		uploaderName: "Dr. Sarah Johnson",
		uploaderAvatar: "https://via.placeholder.com/150x150/007BFF/FFFFFF?text=SJ",
		likesCount: 1234,
		isLiked: false,
		comments: [
			{
				id: "c1",
				userName: "Alex123",
				text: "Great explanation! Finally understand quantum entanglement.",
				replies: [
					{
						id: "c1r1",
						userName: "Dr. Sarah Johnson",
						text: "Glad it helped! Check out my series on quantum mechanics.",
					},
				],
			},
			{
				id: "c2",
				userName: "StudyBuddy",
				text: "This is perfect for my physics exam prep!",
			},
		],
	},
	{
		id: "2",
		title: "Calculus Made Easy: Derivatives",
		videoUrl: "https://www.example.com/video2.mp4",
		uploaderName: "Prof. Mike Chen",
		uploaderAvatar: "https://via.placeholder.com/150x150/28A745/FFFFFF?text=MC",
		likesCount: 2156,
		isLiked: true,
		comments: [
			{
				id: "c3",
				userName: "MathLover",
				text: "Your teaching style is amazing! More calculus videos please.",
			},
			{
				id: "c4",
				userName: "ConfusedStudent",
				text: "Can you explain the chain rule again?",
				replies: [
					{
						id: "c4r1",
						userName: "Prof. Mike Chen",
						text: "I'll create a dedicated video on the chain rule next week!",
					},
					{
						id: "c4r2",
						userName: "HelpfulPeer",
						text: "The key is to work from outside to inside. Practice with simple examples first.",
					},
				],
			},
		],
	},
	{
		id: "3",
		title: "World War 2: Timeline & Key Events",
		videoUrl: "https://www.example.com/video3.mp4",
		uploaderName: "History with Emma",
		uploaderAvatar: "https://via.placeholder.com/150x150/DC3545/FFFFFF?text=HE",
		likesCount: 987,
		isLiked: false,
		comments: [
			{
				id: "c5",
				userName: "HistoryBuff",
				text: "Incredible detail! This helped me understand the Pacific Theater better.",
			},
		],
	},
	{
		id: "4",
		title: "Organic Chemistry: Functional Groups",
		videoUrl: "https://www.example.com/video4.mp4",
		uploaderName: "Chem Genius",
		uploaderAvatar: "https://via.placeholder.com/150x150/FFC107/000000?text=CG",
		likesCount: 1567,
		isLiked: true,
		comments: [
			{
				id: "c6",
				userName: "PreMedStudent",
				text: "This saved my organic chemistry grade!",
			},
		],
	},
	{
		id: "5",
		title: "Spanish Grammar: Subjunctive Mood",
		videoUrl: "https://www.example.com/video5.mp4",
		uploaderName: "Señora Rodriguez",
		uploaderAvatar: "https://via.placeholder.com/150x150/6F42C1/FFFFFF?text=SR",
		likesCount: 678,
		isLiked: false,
		comments: [
			{
				id: "c7",
				userName: "SpanishLearner",
				text: "¡Excelente explicación! Much clearer now.",
			},
		],
	},
];

// Dummy Chat Conversations
export const dummyChats: ChatConversation[] = [
	{
		studyKitId: "sk1",
		studyKitTitle: "Advanced Physics Kit",
		lastMessagePreview:
			"Can you explain quantum superposition in simple terms?",
		lastMessageTimestamp: "2024-01-15 14:30",
		messages: [
			{
				id: "m1",
				speaker: "user",
				messageText:
					"Hi! I'm studying quantum physics and I'm confused about superposition.",
				timestamp: "2024-01-15 14:25",
			},
			{
				id: "m2",
				speaker: "ai",
				messageText:
					"Hello! I'd be happy to help explain quantum superposition. Think of it like a coin that's spinning in the air - until it lands, it's both heads and tails at the same time.",
				timestamp: "2024-01-15 14:26",
			},
			{
				id: "m3",
				speaker: "user",
				messageText:
					"That's a great analogy! But how does measurement collapse the superposition?",
				timestamp: "2024-01-15 14:28",
			},
			{
				id: "m4",
				speaker: "ai",
				messageText:
					'Excellent question! When we measure a quantum system, we force it to "choose" a specific state. It\'s like catching the spinning coin - the act of catching forces it to be either heads or tails.',
				timestamp: "2024-01-15 14:29",
			},
			{
				id: "m5",
				speaker: "user",
				messageText: "Can you explain quantum superposition in simple terms?",
				timestamp: "2024-01-15 14:30",
			},
		],
	},
	{
		studyKitId: "sk2",
		studyKitTitle: "Calculus Fundamentals",
		lastMessagePreview: "What's the difference between limits and derivatives?",
		lastMessageTimestamp: "2024-01-14 09:15",
		messages: [
			{
				id: "m6",
				speaker: "user",
				messageText:
					"I'm struggling with calculus concepts. What's the relationship between limits and derivatives?",
				timestamp: "2024-01-14 09:10",
			},
			{
				id: "m7",
				speaker: "ai",
				messageText:
					"Great question! A derivative is actually defined using limits. The derivative of a function at a point is the limit of the slope of secant lines as they approach that point.",
				timestamp: "2024-01-14 09:12",
			},
			{
				id: "m8",
				speaker: "user",
				messageText: "What's the difference between limits and derivatives?",
				timestamp: "2024-01-14 09:15",
			},
		],
	},
	{
		studyKitId: "sk3",
		studyKitTitle: "World History Timeline",
		lastMessagePreview:
			"Thanks! That timeline really helped me understand the sequence of events.",
		lastMessageTimestamp: "2024-01-13 16:45",
		messages: [
			{
				id: "m9",
				speaker: "user",
				messageText: "Can you help me understand the causes of World War 1?",
				timestamp: "2024-01-13 16:40",
			},
			{
				id: "m10",
				speaker: "ai",
				messageText:
					"Certainly! WWI had multiple causes: militarism, alliances, imperialism, and nationalism (remember MAIN). The immediate trigger was the assassination of Archduke Franz Ferdinand.",
				timestamp: "2024-01-13 16:42",
			},
			{
				id: "m11",
				speaker: "user",
				messageText:
					"Thanks! That timeline really helped me understand the sequence of events.",
				timestamp: "2024-01-13 16:45",
			},
		],
	},
];

// Dummy Study Kits
export const dummyStudyKits: StudyKit[] = [
	{
		id: "sk1",
		title: "Advanced Physics Kit",
		description:
			"Comprehensive study materials for quantum physics, relativity, and particle physics.",
		imageUrl:
			"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-tWzpxAsZMig9oMkoGuBbUJaWvug4ZL.png&w=320&q=75",
		assets: [
			{
				id: "a1",
				type: "video",
				title: "Quantum Mechanics Fundamentals",
				videoUrl: "https://www.example.com/physics-video1.mp4",
			},
			{
				id: "a2",
				type: "quiz",
				title: "Quantum Physics Quiz",
				questionCount: 25,
			},
			{
				id: "a3",
				type: "flashcard",
				title: "Physics Formulas",
				flashcardCount: 50,
			},
			{
				id: "a4",
				type: "video",
				title: "Special Relativity Explained",
				videoUrl: "https://www.example.com/physics-video2.mp4",
			},
		],
	},
	{
		id: "sk2",
		title: "Calculus Fundamentals",
		description:
			"Master the basics of differential and integral calculus with step-by-step explanations.",
		imageUrl:
			"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-OcGyav7XXTTVq0fDXxzmOVek6Noq7s.png&w=320&q=75",
		assets: [
			{
				id: "a5",
				type: "video",
				title: "Introduction to Limits",
				videoUrl: "https://www.example.com/calc-video1.mp4",
			},
			{
				id: "a6",
				type: "quiz",
				title: "Derivatives Practice",
				questionCount: 30,
			},
			{
				id: "a7",
				type: "flashcard",
				title: "Integration Rules",
				flashcardCount: 35,
			},
		],
	},
	{
		id: "sk3",
		title: "World History Timeline",
		description:
			"Explore major historical events from ancient civilizations to modern times.",
		imageUrl:
			"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-RrRJBKqj2fwjfA6iXgCyxb4JFtBPtd.png&w=320&q=75",
		assets: [
			{
				id: "a8",
				type: "video",
				title: "World War 2 Overview",
				videoUrl: "https://www.example.com/history-video1.mp4",
			},
			{
				id: "a9",
				type: "quiz",
				title: "Historical Events Quiz",
				questionCount: 40,
			},
			{
				id: "a10",
				type: "flashcard",
				title: "Important Dates",
				flashcardCount: 60,
			},
		],
	},
	{
		id: "sk4",
		title: "Organic Chemistry",
		description:
			"Comprehensive guide to organic compounds, reactions, and mechanisms.",
		imageUrl:
			"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-SiCUBA0hPD1G7bqTcb5oNbItZc1xd3.png&w=320&q=75",
		assets: [
			{
				id: "a11",
				type: "video",
				title: "Functional Groups",
				videoUrl: "https://www.example.com/chem-video1.mp4",
			},
			{
				id: "a12",
				type: "quiz",
				title: "Reaction Mechanisms",
				questionCount: 20,
			},
			{
				id: "a13",
				type: "flashcard",
				title: "Compound Structures",
				flashcardCount: 45,
			},
		],
	},
	{
		id: "sk5",
		title: "Spanish Language",
		description: "Learn Spanish grammar, vocabulary, and conversation skills.",
		imageUrl:
			"https://www.thiings.co/_next/image?url=https%3A%2F%2Flftz25oez4aqbxpq.public.blob.vercel-storage.com%2Fimage-fXMLH4G3QyrtmtgNBu8aPO4v7bVV2I.png&w=320&q=75",
		assets: [
			{
				id: "a14",
				type: "video",
				title: "Spanish Grammar Basics",
				videoUrl: "https://www.example.com/spanish-video1.mp4",
			},
			{
				id: "a15",
				type: "quiz",
				title: "Vocabulary Test",
				questionCount: 50,
			},
			{
				id: "a16",
				type: "flashcard",
				title: "Common Phrases",
				flashcardCount: 100,
			},
		],
	},
];

// Dummy Study Kit Groups
export const dummyStudyKitGroups: StudyKitGroup[] = [
	{
		id: "g1",
		name: "STEM Subjects",
		studyKitIds: ["sk1", "sk2", "sk4"],
	},
	{
		id: "g2",
		name: "Humanities",
		studyKitIds: ["sk3", "sk5"],
	},
	{
		id: "g3",
		name: "Advanced Topics",
		studyKitIds: ["sk1", "sk4"],
	},
];

// Dummy User Profile
export const dummyUserProfile: UserProfile = {
	id: "user1",
	username: "john_studier",
	email: "john.doe@email.com",
	profilePicture: "https://via.placeholder.com/150x150/007BFF/FFFFFF?text=JD",
};

// Helper functions to get data
export const getStudyKitById = (id: string): StudyKit | undefined => {
	return dummyStudyKits.find((kit) => kit.id === id);
};

export const getStudyKitsByGroupId = (groupId: string): StudyKit[] => {
	const group = dummyStudyKitGroups.find((g) => g.id === groupId);
	if (!group) return [];
	return group.studyKitIds
		.map((id) => getStudyKitById(id))
		.filter(Boolean) as StudyKit[];
};

export const getChatById = (
	studyKitId: string,
): ChatConversation | undefined => {
	return dummyChats.find((chat) => chat.studyKitId === studyKitId);
};
