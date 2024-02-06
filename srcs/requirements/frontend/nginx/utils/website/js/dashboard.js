const ctx = document.getElementById('myChart');

new Chart(ctx, {
  type: 'doughnut',
  data: {
	labels: [
		'Win',
		'Loss',
	  ],
	  datasets: [{
		label: 'Win/Loss',
		data: [300, 50],
		backgroundColor: [
		'rgb(54, 162, 235)',
		  'rgb(255, 99, 132)',
		],
		hoverOffset: 4
	  }]
	},
	options: {
		layout: {
			padding: {
			    left: 30
			}
		}
	}
});

const ctx2 = document.getElementById('myChart2');

new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: ['Points Scored', 'Points Allowed'],
        datasets: [{
            barPercentage: 0.5,
            minBarLength: 2,
            data: [500, 50],
            backgroundColor: [
                'rgb(54, 162, 235)',
                'rgb(255, 99, 132)',
            ],
            hoverOffset: 4
        }],
    },
    options: {
        layout: {
            // padding: {
            //     top: 20  // Ajoute 20 pixels d'espace en haut du graphique
            // }

        },
		indexAxis: 'y',
    }
});

const ctxPolar = document.getElementById('myChartPolar').getContext('2d');

new Chart(ctxPolar, {
    type: 'polarArea',
    data: {
		labels: ['Catégorie 1', 'Catégorie 2', 'Catégorie 3', 'Catégorie 4'],
        datasets: [{
			label: 'Games played',
            data: [11, 16, 7, 3],
            backgroundColor: [
				'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)'
            ],
            // borderColor: [
				//     'rgba(255,99,132,1)',
				//     'rgba(54, 162, 235, 1)',
				//     'rgba(255, 206, 86, 1)',
				//     'rgba(75, 192, 192, 1)'
				// ],
				borderWidth: 1
			}]
		},
		options: {
			scale: {
				ticks: {
					beginAtZero: true
				}
			},
			animation:
			{
				animateScale: true,
				animateRotate: true
			}
		}
	});