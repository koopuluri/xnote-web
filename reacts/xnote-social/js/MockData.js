module.exports = {
	init: function() {
		localStorage.clear();
		localStorage.setItem('feed', JSON.stringify([
			{
				type: 'NOTE',
				lastModifiedAt: 8,
				object : {
					createdAt: 7,
					createdBy: {
						name: 'Karajgikar',
						id: '1234'
					},
					highlightId : 'opiu',
					article : {
						articleId : 'asdf',
						title : 'Why Startups Succeed?',
						url : 'www.medium.com/Why_Startups_Succeed?'
					},
					clippedText : 'Because teams work hard and have a great idea',
					notes : [
						{
							createdBy : {
								name: 'Karthik',
								id: '1234'
							},
							createdAt: 7,
							content : 'Youre right its not that straightforward',
							highlightId : '1234',
							noteId: 'poiu'
						},
						{
							createdBy: {
								name: 'Harithas',
								id: 'opiu'
							},
							createdAt : 6,
							content : 'But look at Google Plus theyre awesome but failed',
							highlightId: '1234',
							noteId : 'qwer'
						},
						{
							createdBy : {
								username : 'Karajgikar',
								id: '1234'
							},
							createdAt : 4,
							content : 'Hmm interesting',
							highlightId: '1234',
							noteId : '0987'									
						}
					]
				}
			},
			{
				type: 'ARTICLE',
				lastModifiedAt: 6,
				object: {
					title: 'Xnote Home',
					url: 'www.xnote.io',
					createdAt: 2,
					createdBy: {
						name: 'Karthik',
						id: 'asdf'
					},
					articleId: 'asdf',
					serialization: 'blahblahblah',
					content: 'Xnote is freaking awesome.'
				}
			},
			{
				type: 'NOTE',
				lastModifiedAt: 6,
				object: {
					createdAt: 6,
					createdBy: {
						name: 'Harithas',
						id: '1234'
					},
					highlightId : 'lkj',
					article : {
						articleId : 'asdf',
						title : 'Xnote Home',
						url : 'www.xnote.io'
					},
					clippedText : 'Xnote is freaking awesome.',
					notes : []
				}
			}
		]));

		localStorage.setItem('chat', JSON.stringify([
			{
				createdBy : {
					name: 'Varun',							
					id: '134'
				},
				content : 'Yo',
				createdAt : 10 
			},
			{
				createdBy : {
					name : 'Vignesh',
					id: '1231'
				},
				content : 'Whats up?',
				createdAt : 9
			},
			{
				createdBy: {
					name: 'Deshmudre',
					id: '12312'
				},
				content : 'This is awesome',
				createdAt : 8
			}
		]));
	}
}