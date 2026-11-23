// DEMO DATA ONLY — a fictional video and fictional commenters, used by the "View Sample Report" button
// so the dashboard can be previewed without signing in or running the backend.
// Generated with the backend's own report builder, so it has exactly the shape of a real report.
// To remove the sample feature, delete this file and the 'viewSampleReport' references.
export const sampleReport = {
 "id": "sample",
 "url": null,
 "title": "Sample report: Introduction to REST APIs",
 "channel": "Demo Channel",
 "channelAvatar": null,
 "thumbnail": null,
 "publishedDate": "September 1, 2026",
 "analyzedAt": "Demo data",
 "totalCommentsAnalyzed": 160,
 "totalViews": "48.2K",
 "videoDuration": "10:12",
 "overallScore": 72,
 "sentimentLabel": "Positive",
 "sentimentSubtitle": "Net positive audience",
 "breakdown": {
  "positive": {
   "count": 94,
   "percentage": 58.8,
   "color": "#34d399"
  },
  "neutral": {
   "count": 43,
   "percentage": 26.9,
   "color": "#a78bfa"
  },
  "negative": {
   "count": 23,
   "percentage": 14.4,
   "color": "#f87171"
  }
 },
 "trendTimeline": [
  {
   "date": "Sep 01",
   "isoDate": "2026-09-01",
   "positive": 5,
   "neutral": 2,
   "negative": 0,
   "toxic": 0
  },
  {
   "date": "Sep 03",
   "isoDate": "2026-09-03",
   "positive": 15,
   "neutral": 4,
   "negative": 5,
   "toxic": 2
  },
  {
   "date": "Sep 05",
   "isoDate": "2026-09-05",
   "positive": 11,
   "neutral": 4,
   "negative": 3,
   "toxic": 1
  },
  {
   "date": "Sep 07",
   "isoDate": "2026-09-07",
   "positive": 14,
   "neutral": 9,
   "negative": 2,
   "toxic": 0
  },
  {
   "date": "Sep 09",
   "isoDate": "2026-09-09",
   "positive": 5,
   "neutral": 6,
   "negative": 4,
   "toxic": 1
  },
  {
   "date": "Sep 11",
   "isoDate": "2026-09-11",
   "positive": 17,
   "neutral": 5,
   "negative": 2,
   "toxic": 0
  },
  {
   "date": "Sep 13",
   "isoDate": "2026-09-13",
   "positive": 5,
   "neutral": 4,
   "negative": 0,
   "toxic": 0
  },
  {
   "date": "Sep 15",
   "isoDate": "2026-09-15",
   "positive": 6,
   "neutral": 4,
   "negative": 3,
   "toxic": 3
  },
  {
   "date": "Sep 17",
   "isoDate": "2026-09-17",
   "positive": 8,
   "neutral": 2,
   "negative": 3,
   "toxic": 0
  },
  {
   "date": "Sep 19",
   "isoDate": "2026-09-19",
   "positive": 3,
   "neutral": 3,
   "negative": 1,
   "toxic": 0
  },
  {
   "date": "Sep 21",
   "isoDate": "2026-09-21",
   "positive": 5,
   "neutral": 0,
   "negative": 0,
   "toxic": 0
  }
 ],
 "highlightLists": {
  "mostLiked": [
   {
    "id": "s113",
    "author": "@nina_builds",
    "likes": 15,
    "sentiment": "positive",
    "confidence": 0.688,
    "text": "Amazing video, thank you so much 👏",
    "date": "Sep 12, 2026",
    "avatar": null,
    "toxicity": 0.12
   },
   {
    "id": "s41",
    "author": "@jules_ux",
    "likes": 15,
    "sentiment": "positive",
    "confidence": 0.623,
    "text": "Great REST API explanation 🔥 #beginners",
    "date": "Sep 06, 2026",
    "avatar": null,
    "toxicity": 0.12
   },
   {
    "id": "s48",
    "author": "@code_with_mia",
    "likes": 14,
    "sentiment": "positive",
    "confidence": 0.93,
    "text": "The GraphQL part was super helpful 🙏",
    "date": "Sep 11, 2026",
    "avatar": null,
    "toxicity": 0.02
   },
   {
    "id": "s42",
    "author": "@kavya_codes",
    "likes": 14,
    "sentiment": "negative",
    "confidence": 0.819,
    "text": "The examples were hard to follow",
    "date": "Sep 05, 2026",
    "avatar": null,
    "toxicity": 0.12
   },
   {
    "id": "s90",
    "author": "@priya_in_code",
    "likes": 13,
    "sentiment": "neutral",
    "confidence": 0.88,
    "text": "Can you make a video on GraphQL?",
    "date": "Sep 07, 2026",
    "avatar": null,
    "toxicity": 0.12
   }
  ],
  "topPositive": [
   {
    "id": "s113",
    "author": "@nina_builds",
    "likes": 15,
    "sentiment": "positive",
    "confidence": 0.688,
    "text": "Amazing video, thank you so much 👏",
    "date": "Sep 12, 2026",
    "avatar": null,
    "toxicity": 0.12
   },
   {
    "id": "s41",
    "author": "@jules_ux",
    "likes": 15,
    "sentiment": "positive",
    "confidence": 0.623,
    "text": "Great REST API explanation 🔥 #beginners",
    "date": "Sep 06, 2026",
    "avatar": null,
    "toxicity": 0.12
   },
   {
    "id": "s48",
    "author": "@code_with_mia",
    "likes": 14,
    "sentiment": "positive",
    "confidence": 0.93,
    "text": "The GraphQL part was super helpful 🙏",
    "date": "Sep 11, 2026",
    "avatar": null,
    "toxicity": 0.02
   },
   {
    "id": "s18",
    "author": "@nina_builds",
    "likes": 12,
    "sentiment": "positive",
    "confidence": 0.946,
    "text": "The GraphQL part was super helpful 🙏",
    "date": "Sep 02, 2026",
    "avatar": null,
    "toxicity": 0.01
   },
   {
    "id": "s29",
    "author": "@code_with_mia",
    "likes": 12,
    "sentiment": "positive",
    "confidence": 0.641,
    "text": "Amazing video, thank you so much 👏",
    "date": "Sep 03, 2026",
    "avatar": null,
    "toxicity": 0.01
   }
  ],
  "topCritical": [
   {
    "id": "s42",
    "author": "@kavya_codes",
    "likes": 14,
    "sentiment": "negative",
    "confidence": 0.819,
    "text": "The examples were hard to follow",
    "date": "Sep 05, 2026",
    "avatar": null,
    "toxicity": 0.12
   },
   {
    "id": "s50",
    "author": "@priya_in_code",
    "likes": 8,
    "sentiment": "negative",
    "confidence": 0.928,
    "text": "Useless explanation, waste of time 😡",
    "date": "Sep 03, 2026",
    "avatar": null,
    "toxicity": 0.52
   },
   {
    "id": "s118",
    "author": "@jules_ux",
    "likes": 8,
    "sentiment": "negative",
    "confidence": 0.912,
    "text": "You are an idiot, this is garbage",
    "date": "Sep 16, 2026",
    "avatar": null,
    "toxicity": 0.94
   },
   {
    "id": "s140",
    "author": "@api_learner",
    "likes": 8,
    "sentiment": "negative",
    "confidence": 0.614,
    "text": "You are an idiot, this is garbage",
    "date": "Sep 09, 2026",
    "avatar": null,
    "toxicity": 0.94
   },
   {
    "id": "s126",
    "author": "@code_with_mia",
    "likes": 6,
    "sentiment": "negative",
    "confidence": 0.894,
    "text": "You are an idiot, this is garbage",
    "date": "Sep 04, 2026",
    "avatar": null,
    "toxicity": 0.94
   }
  ]
 },
 "tags": [
  {
   "name": "#Rest",
   "count": 25,
   "sentiment": "positive"
  },
  {
   "name": "#Graphql",
   "count": 24,
   "sentiment": "positive"
  },
  {
   "name": "#BestBreakdown",
   "count": 16,
   "sentiment": "positive"
  },
  {
   "name": "#Seen",
   "count": 16,
   "sentiment": "positive"
  },
  {
   "name": "#Soap",
   "count": 16,
   "sentiment": "positive"
  },
  {
   "name": "#Explanation",
   "count": 13,
   "sentiment": "positive"
  },
  {
   "name": "#FinallyUnderstand",
   "count": 13,
   "sentiment": "positive"
  },
  {
   "name": "#GraphqlPart",
   "count": 13,
   "sentiment": "positive"
  },
  {
   "name": "#Helped",
   "count": 13,
   "sentiment": "positive"
  },
  {
   "name": "#SuperHelpful",
   "count": 13,
   "sentiment": "positive"
  },
  {
   "name": "#UnderstandApis",
   "count": 13,
   "sentiment": "positive"
  },
  {
   "name": "#Amazing",
   "count": 12,
   "sentiment": "positive"
  },
  {
   "name": "#Animations",
   "count": 11,
   "sentiment": "positive"
  },
  {
   "name": "#KeepMaking",
   "count": 11,
   "sentiment": "positive"
  },
  {
   "name": "#WebhookExample",
   "count": 11,
   "sentiment": "positive"
  },
  {
   "name": "#ApiExplanation",
   "count": 9,
   "sentiment": "positive"
  },
  {
   "name": "#CrystalClear",
   "count": 9,
   "sentiment": "positive"
  },
  {
   "name": "#GreatRest",
   "count": 9,
   "sentiment": "positive"
  },
  {
   "name": "#Header",
   "count": 9,
   "sentiment": "neutral"
  },
  {
   "name": "#RestApi",
   "count": 9,
   "sentiment": "positive"
  },
  {
   "name": "#Subscribed",
   "count": 9,
   "sentiment": "positive"
  },
  {
   "name": "#beginners",
   "count": 9,
   "sentiment": "positive"
  },
  {
   "name": "#Diagrams",
   "count": 8,
   "sentiment": "neutral"
  },
  {
   "name": "#Tool",
   "count": 8,
   "sentiment": "neutral"
  }
 ],
 "emojis": [
  {
   "emoji": "🙏",
   "name": "Folded Hands",
   "count": 13,
   "percentage": 8.1,
   "mood": "Grateful"
  },
  {
   "emoji": "🙌",
   "name": "Raised Hands",
   "count": 13,
   "percentage": 8.1,
   "mood": "Grateful"
  },
  {
   "emoji": "👏",
   "name": "Applause",
   "count": 12,
   "percentage": 7.5,
   "mood": "Appreciative"
  },
  {
   "emoji": "💯",
   "name": "Hundred",
   "count": 11,
   "percentage": 6.9,
   "mood": "Impressed"
  },
  {
   "emoji": "❤",
   "name": "Heart",
   "count": 9,
   "percentage": 5.6,
   "mood": "Loving"
  },
  {
   "emoji": "🔥",
   "name": "Fire",
   "count": 9,
   "percentage": 5.6,
   "mood": "Excited"
  }
 ],
 "comments": [],
 "topKeywords": [
  {
   "word": "rest",
   "count": 25,
   "sentiment": "positive",
   "positive": 25,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "graphql",
   "count": 24,
   "sentiment": "positive",
   "positive": 13,
   "neutral": 11,
   "negative": 0
  },
  {
   "word": "best breakdown",
   "count": 16,
   "sentiment": "positive",
   "positive": 16,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "seen",
   "count": 16,
   "sentiment": "positive",
   "positive": 16,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "soap",
   "count": 16,
   "sentiment": "positive",
   "positive": 16,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "finally understand",
   "count": 13,
   "sentiment": "positive",
   "positive": 13,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "graphql part",
   "count": 13,
   "sentiment": "positive",
   "positive": 13,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "super helpful",
   "count": 13,
   "sentiment": "positive",
   "positive": 13,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "understand apis",
   "count": 13,
   "sentiment": "positive",
   "positive": 13,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "explanation",
   "count": 13,
   "sentiment": "positive",
   "positive": 9,
   "neutral": 0,
   "negative": 4
  },
  {
   "word": "helped",
   "count": 13,
   "sentiment": "positive",
   "positive": 13,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "amazing",
   "count": 12,
   "sentiment": "positive",
   "positive": 12,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "keep making",
   "count": 11,
   "sentiment": "positive",
   "positive": 11,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "webhook example",
   "count": 11,
   "sentiment": "positive",
   "positive": 11,
   "neutral": 0,
   "negative": 0
  },
  {
   "word": "animations",
   "count": 11,
   "sentiment": "positive",
   "positive": 11,
   "neutral": 0,
   "negative": 0
  }
 ],
 "toxicity": {
  "available": true,
  "analyzed": 160,
  "toxicCount": 7,
  "toxicPercentage": 4.4,
  "borderlineCount": 4,
  "borderlinePercentage": 2.5,
  "cleanCount": 149,
  "cleanPercentage": 93.1,
  "averageScore": 0.11,
  "healthScore": 94,
  "level": "Moderate",
  "categories": [
   {
    "key": "toxic",
    "name": "Toxic",
    "count": 11,
    "percentage": 6.9
   },
   {
    "key": "severe_toxic",
    "name": "Severe Toxic",
    "count": 0,
    "percentage": 0.0
   },
   {
    "key": "obscene",
    "name": "Obscene",
    "count": 0,
    "percentage": 0.0
   },
   {
    "key": "threat",
    "name": "Threat",
    "count": 0,
    "percentage": 0.0
   },
   {
    "key": "insult",
    "name": "Insult",
    "count": 7,
    "percentage": 4.4
   },
   {
    "key": "identity_hate",
    "name": "Identity Hate",
    "count": 0,
    "percentage": 0.0
   }
  ],
  "mostToxic": [
   {
    "id": "s20",
    "author": "@rohit_codes",
    "likes": 6,
    "sentiment": "negative",
    "confidence": 0.831,
    "text": "You are an idiot, this is garbage",
    "date": "Sep 06, 2026",
    "avatar": null,
    "toxicity": 0.94,
    "score": 0.94,
    "label": "TOXIC",
    "flags": [
     "toxic",
     "insult"
    ]
   },
   {
    "id": "s118",
    "author": "@jules_ux",
    "likes": 8,
    "sentiment": "negative",
    "confidence": 0.912,
    "text": "You are an idiot, this is garbage",
    "date": "Sep 16, 2026",
    "avatar": null,
    "toxicity": 0.94,
    "score": 0.94,
    "label": "TOXIC",
    "flags": [
     "toxic",
     "insult"
    ]
   },
   {
    "id": "s120",
    "author": "@code_with_mia",
    "likes": 3,
    "sentiment": "negative",
    "confidence": 0.937,
    "text": "You are an idiot, this is garbage",
    "date": "Sep 16, 2026",
    "avatar": null,
    "toxicity": 0.94,
    "score": 0.94,
    "label": "TOXIC",
    "flags": [
     "toxic",
     "insult"
    ]
   },
   {
    "id": "s125",
    "author": "@sam_tech",
    "likes": 0,
    "sentiment": "negative",
    "confidence": 0.735,
    "text": "You are an idiot, this is garbage",
    "date": "Sep 04, 2026",
    "avatar": null,
    "toxicity": 0.94,
    "score": 0.94,
    "label": "TOXIC",
    "flags": [
     "toxic",
     "insult"
    ]
   },
   {
    "id": "s126",
    "author": "@code_with_mia",
    "likes": 6,
    "sentiment": "negative",
    "confidence": 0.894,
    "text": "You are an idiot, this is garbage",
    "date": "Sep 04, 2026",
    "avatar": null,
    "toxicity": 0.94,
    "score": 0.94,
    "label": "TOXIC",
    "flags": [
     "toxic",
     "insult"
    ]
   }
  ]
 },
 "users": {
  "summary": {
   "uniqueCommenters": 12,
   "repeatCommenters": 12,
   "averageCommentsPerUser": 13.33,
   "toxicCommenters": 6,
   "withSubscriberData": 7
  },
  "mostActive": [
   {
    "authorId": "id-@code_with_mia",
    "name": "@code_with_mia",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 22,
    "totalLikes": 77,
    "totalReplies": 26,
    "positive": 12,
    "neutral": 5,
    "negative": 5,
    "toxicComments": 2,
    "maxToxicity": 0.94,
    "subscribers": 15000,
    "subscribersFormatted": "15K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@rohit_codes",
    "name": "@rohit_codes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 21,
    "totalLikes": 81,
    "totalReplies": 31,
    "positive": 14,
    "neutral": 5,
    "negative": 2,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 880,
    "subscribersFormatted": "880",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@priya_in_code",
    "name": "@priya_in_code",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 16,
    "totalLikes": 67,
    "totalReplies": 32,
    "positive": 11,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@jules_ux",
    "name": "@jules_ux",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 16,
    "totalLikes": 47,
    "totalReplies": 28,
    "positive": 10,
    "neutral": 4,
    "negative": 2,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@devnotes",
    "name": "@devnotes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 15,
    "totalLikes": 32,
    "totalReplies": 28,
    "positive": 9,
    "neutral": 4,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.12,
    "subscribers": 2500000,
    "subscribersFormatted": "2.5M",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@leo_writes",
    "name": "@leo_writes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 14,
    "totalLikes": 37,
    "totalReplies": 17,
    "positive": 6,
    "neutral": 6,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@nina_builds",
    "name": "@nina_builds",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 13,
    "totalLikes": 62,
    "totalReplies": 25,
    "positive": 9,
    "neutral": 3,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 4200,
    "subscribersFormatted": "4.2K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@api_learner",
    "name": "@api_learner",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 11,
    "totalLikes": 31,
    "totalReplies": 16,
    "positive": 8,
    "neutral": 2,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 120000,
    "subscribersFormatted": "120K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@kavya_codes",
    "name": "@kavya_codes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 9,
    "totalLikes": 33,
    "totalReplies": 11,
    "positive": 4,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@omar_dev",
    "name": "@omar_dev",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 9,
    "totalLikes": 32,
    "totalReplies": 17,
    "positive": 4,
    "neutral": 4,
    "negative": 1,
    "toxicComments": 0,
    "maxToxicity": 0.12,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   }
  ],
  "mostLiked": [
   {
    "authorId": "id-@rohit_codes",
    "name": "@rohit_codes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 21,
    "totalLikes": 81,
    "totalReplies": 31,
    "positive": 14,
    "neutral": 5,
    "negative": 2,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 880,
    "subscribersFormatted": "880",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@code_with_mia",
    "name": "@code_with_mia",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 22,
    "totalLikes": 77,
    "totalReplies": 26,
    "positive": 12,
    "neutral": 5,
    "negative": 5,
    "toxicComments": 2,
    "maxToxicity": 0.94,
    "subscribers": 15000,
    "subscribersFormatted": "15K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@priya_in_code",
    "name": "@priya_in_code",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 16,
    "totalLikes": 67,
    "totalReplies": 32,
    "positive": 11,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@nina_builds",
    "name": "@nina_builds",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 13,
    "totalLikes": 62,
    "totalReplies": 25,
    "positive": 9,
    "neutral": 3,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 4200,
    "subscribersFormatted": "4.2K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@jules_ux",
    "name": "@jules_ux",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 16,
    "totalLikes": 47,
    "totalReplies": 28,
    "positive": 10,
    "neutral": 4,
    "negative": 2,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@leo_writes",
    "name": "@leo_writes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 14,
    "totalLikes": 37,
    "totalReplies": 17,
    "positive": 6,
    "neutral": 6,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@kavya_codes",
    "name": "@kavya_codes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 9,
    "totalLikes": 33,
    "totalReplies": 11,
    "positive": 4,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@devnotes",
    "name": "@devnotes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 15,
    "totalLikes": 32,
    "totalReplies": 28,
    "positive": 9,
    "neutral": 4,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.12,
    "subscribers": 2500000,
    "subscribersFormatted": "2.5M",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@omar_dev",
    "name": "@omar_dev",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 9,
    "totalLikes": 32,
    "totalReplies": 17,
    "positive": 4,
    "neutral": 4,
    "negative": 1,
    "toxicComments": 0,
    "maxToxicity": 0.12,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@api_learner",
    "name": "@api_learner",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 11,
    "totalLikes": 31,
    "totalReplies": 16,
    "positive": 8,
    "neutral": 2,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 120000,
    "subscribersFormatted": "120K",
    "subscribersHidden": false
   }
  ],
  "topFans": [],
  "mostCritical": [
   {
    "authorId": "id-@code_with_mia",
    "name": "@code_with_mia",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 22,
    "totalLikes": 77,
    "totalReplies": 26,
    "positive": 12,
    "neutral": 5,
    "negative": 5,
    "toxicComments": 2,
    "maxToxicity": 0.94,
    "subscribers": 15000,
    "subscribersFormatted": "15K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@rohit_codes",
    "name": "@rohit_codes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 21,
    "totalLikes": 81,
    "totalReplies": 31,
    "positive": 14,
    "neutral": 5,
    "negative": 2,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 880,
    "subscribersFormatted": "880",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@priya_in_code",
    "name": "@priya_in_code",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 16,
    "totalLikes": 67,
    "totalReplies": 32,
    "positive": 11,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@jules_ux",
    "name": "@jules_ux",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 16,
    "totalLikes": 47,
    "totalReplies": 28,
    "positive": 10,
    "neutral": 4,
    "negative": 2,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@leo_writes",
    "name": "@leo_writes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 14,
    "totalLikes": 37,
    "totalReplies": 17,
    "positive": 6,
    "neutral": 6,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@kavya_codes",
    "name": "@kavya_codes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 9,
    "totalLikes": 33,
    "totalReplies": 11,
    "positive": 4,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@devnotes",
    "name": "@devnotes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 15,
    "totalLikes": 32,
    "totalReplies": 28,
    "positive": 9,
    "neutral": 4,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.12,
    "subscribers": 2500000,
    "subscribersFormatted": "2.5M",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@tara_dev",
    "name": "@tara_dev",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 8,
    "totalLikes": 25,
    "totalReplies": 19,
    "positive": 3,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.12,
    "subscribers": 310,
    "subscribersFormatted": "310",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@nina_builds",
    "name": "@nina_builds",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 13,
    "totalLikes": 62,
    "totalReplies": 25,
    "positive": 9,
    "neutral": 3,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 4200,
    "subscribersFormatted": "4.2K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@omar_dev",
    "name": "@omar_dev",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 9,
    "totalLikes": 32,
    "totalReplies": 17,
    "positive": 4,
    "neutral": 4,
    "negative": 1,
    "toxicComments": 0,
    "maxToxicity": 0.12,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   }
  ],
  "mostToxic": [
   {
    "authorId": "id-@code_with_mia",
    "name": "@code_with_mia",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 22,
    "totalLikes": 77,
    "totalReplies": 26,
    "positive": 12,
    "neutral": 5,
    "negative": 5,
    "toxicComments": 2,
    "maxToxicity": 0.94,
    "subscribers": 15000,
    "subscribersFormatted": "15K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@rohit_codes",
    "name": "@rohit_codes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 21,
    "totalLikes": 81,
    "totalReplies": 31,
    "positive": 14,
    "neutral": 5,
    "negative": 2,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 880,
    "subscribersFormatted": "880",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@jules_ux",
    "name": "@jules_ux",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 16,
    "totalLikes": 47,
    "totalReplies": 28,
    "positive": 10,
    "neutral": 4,
    "negative": 2,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@nina_builds",
    "name": "@nina_builds",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 13,
    "totalLikes": 62,
    "totalReplies": 25,
    "positive": 9,
    "neutral": 3,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 4200,
    "subscribersFormatted": "4.2K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@api_learner",
    "name": "@api_learner",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 11,
    "totalLikes": 31,
    "totalReplies": 16,
    "positive": 8,
    "neutral": 2,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 120000,
    "subscribersFormatted": "120K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@sam_tech",
    "name": "@sam_tech",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 6,
    "totalLikes": 8,
    "totalReplies": 7,
    "positive": 4,
    "neutral": 1,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 90000,
    "subscribersFormatted": "90K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@leo_writes",
    "name": "@leo_writes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 14,
    "totalLikes": 37,
    "totalReplies": 17,
    "positive": 6,
    "neutral": 6,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@kavya_codes",
    "name": "@kavya_codes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 9,
    "totalLikes": 33,
    "totalReplies": 11,
    "positive": 4,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   },
   {
    "authorId": "id-@priya_in_code",
    "name": "@priya_in_code",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 16,
    "totalLikes": 67,
    "totalReplies": 32,
    "positive": 11,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.52,
    "subscribers": null,
    "subscribersFormatted": null,
    "subscribersHidden": true
   }
  ],
  "topSubscribers": [
   {
    "authorId": "id-@devnotes",
    "name": "@devnotes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 15,
    "totalLikes": 32,
    "totalReplies": 28,
    "positive": 9,
    "neutral": 4,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.12,
    "subscribers": 2500000,
    "subscribersFormatted": "2.5M",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@api_learner",
    "name": "@api_learner",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 11,
    "totalLikes": 31,
    "totalReplies": 16,
    "positive": 8,
    "neutral": 2,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 120000,
    "subscribersFormatted": "120K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@sam_tech",
    "name": "@sam_tech",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 6,
    "totalLikes": 8,
    "totalReplies": 7,
    "positive": 4,
    "neutral": 1,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 90000,
    "subscribersFormatted": "90K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@code_with_mia",
    "name": "@code_with_mia",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 22,
    "totalLikes": 77,
    "totalReplies": 26,
    "positive": 12,
    "neutral": 5,
    "negative": 5,
    "toxicComments": 2,
    "maxToxicity": 0.94,
    "subscribers": 15000,
    "subscribersFormatted": "15K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@nina_builds",
    "name": "@nina_builds",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 13,
    "totalLikes": 62,
    "totalReplies": 25,
    "positive": 9,
    "neutral": 3,
    "negative": 1,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 4200,
    "subscribersFormatted": "4.2K",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@rohit_codes",
    "name": "@rohit_codes",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 21,
    "totalLikes": 81,
    "totalReplies": 31,
    "positive": 14,
    "neutral": 5,
    "negative": 2,
    "toxicComments": 1,
    "maxToxicity": 0.94,
    "subscribers": 880,
    "subscribersFormatted": "880",
    "subscribersHidden": false
   },
   {
    "authorId": "id-@tara_dev",
    "name": "@tara_dev",
    "avatar": null,
    "profileUrl": null,
    "commentCount": 8,
    "totalLikes": 25,
    "totalReplies": 19,
    "positive": 3,
    "neutral": 3,
    "negative": 2,
    "toxicComments": 0,
    "maxToxicity": 0.12,
    "subscribers": 310,
    "subscribersFormatted": "310",
    "subscribersHidden": false
   }
  ]
 },
 "engagement": {
  "totalCommentLikes": 532,
  "averageLikesPerComment": 3.33,
  "totalReplies": 257,
  "repliedCommentsPercentage": 78.8,
  "averageCommentLength": 36
 },
 "charts": {
  "likesByBucket": [
   {
    "label": "0",
    "count": 36
   },
   {
    "label": "1-2",
    "count": 51
   },
   {
    "label": "3-9",
    "count": 59
   },
   {
    "label": "10-49",
    "count": 14
   },
   {
    "label": "50+",
    "count": 0
   }
  ],
  "lengthBySentiment": [
   {
    "label": "1-20",
    "positive": 0,
    "neutral": 0,
    "negative": 0,
    "total": 0
   },
   {
    "label": "21-60",
    "positive": 94,
    "neutral": 43,
    "negative": 23,
    "total": 160
   },
   {
    "label": "61-120",
    "positive": 0,
    "neutral": 0,
    "negative": 0,
    "total": 0
   },
   {
    "label": "121-250",
    "positive": 0,
    "neutral": 0,
    "negative": 0,
    "total": 0
   },
   {
    "label": "250+",
    "positive": 0,
    "neutral": 0,
    "negative": 0,
    "total": 0
   }
  ],
  "engagementBySentiment": [
   {
    "sentiment": "positive",
    "comments": 94,
    "totalLikes": 322,
    "averageLikes": 3.43,
    "averageConfidence": 0.789
   },
   {
    "sentiment": "neutral",
    "comments": 43,
    "totalLikes": 136,
    "averageLikes": 3.16,
    "averageConfidence": 0.799
   },
   {
    "sentiment": "negative",
    "comments": 23,
    "totalLikes": 74,
    "averageLikes": 3.22,
    "averageConfidence": 0.802
   }
  ],
  "toxicityHistogram": [
   {
    "label": "0-10%",
    "count": 113
   },
   {
    "label": "10-20%",
    "count": 36
   },
   {
    "label": "20-30%",
    "count": 0
   },
   {
    "label": "30-40%",
    "count": 0
   },
   {
    "label": "40-50%",
    "count": 0
   },
   {
    "label": "50-60%",
    "count": 4
   },
   {
    "label": "60-70%",
    "count": 0
   },
   {
    "label": "70-80%",
    "count": 0
   },
   {
    "label": "80-90%",
    "count": 0
   },
   {
    "label": "90-100%",
    "count": 7
   }
  ],
  "toxicityBySentiment": {
   "positive": {
    "CLEAN": 94,
    "BORDERLINE": 0,
    "TOXIC": 0
   },
   "neutral": {
    "CLEAN": 43,
    "BORDERLINE": 0,
    "TOXIC": 0
   },
   "negative": {
    "CLEAN": 12,
    "BORDERLINE": 4,
    "TOXIC": 7
   }
  },
  "commenterBuckets": [
   {
    "label": "1 comment",
    "users": 0,
    "comments": 0
   },
   {
    "label": "2 comments",
    "users": 0,
    "comments": 0
   },
   {
    "label": "3+ comments",
    "users": 12,
    "comments": 160
   }
  ]
 },
 "channelStats": {
  "title": "Demo Channel",
  "avatar": null,
  "subscribers": null,
  "subscribersFormatted": null,
  "channelUrl": null
 },
 "videoStats": {
  "views": 48200,
  "likes": 2100,
  "totalComments": 210,
  "commentsAnalyzed": 160,
  "durationSeconds": 612
 },
 "isSample": true
};
