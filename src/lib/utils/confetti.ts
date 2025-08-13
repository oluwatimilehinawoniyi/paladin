declare global {
	interface Window {
		confetti: any;
	}
}

export function triggerSuccessConfetti() {
	if (typeof window !== 'undefined' && window.confetti) {
		// Burst of confetti from multiple positions
		const count = 200;
		const defaults = {
			origin: { y: 0.7 },
			zIndex: 9999
		};

		function fire(particleRatio: number, opts: any) {
			window.confetti({
				...defaults,
				...opts,
				particleCount: Math.floor(count * particleRatio)
			});
		}

		// Multiple bursts for dramatic effect
		fire(0.25, {
			spread: 26,
			startVelocity: 55,
			colors: ['#ff4d00', '#ff6b00', '#ff8800']
		});

		fire(0.2, {
			spread: 60,
			colors: ['#00ff00', '#00cc00', '#009900']
		});

		fire(0.35, {
			spread: 100,
			decay: 0.91,
			scalar: 0.8,
			colors: ['#0099ff', '#0066cc', '#003399']
		});

		fire(0.1, {
			spread: 120,
			startVelocity: 25,
			decay: 0.92,
			scalar: 1.2,
			colors: ['#ff69b4', '#ff1493', '#dc143c']
		});

		fire(0.1, {
			spread: 120,
			startVelocity: 45,
			colors: ['#ffd700', '#ffed4e', '#fff700']
		});
	}
}

export function triggerCelebrationConfetti() {
	if (typeof window !== 'undefined' && window.confetti) {
		const duration = 3000;
		const end = Date.now() + duration;

		const interval = setInterval(() => {
			if (Date.now() > end) {
				clearInterval(interval);
				return;
			}

			window.confetti({
				particleCount: 50,
				startVelocity: 30,
				spread: 360,
				origin: {
					x: Math.random(),
					y: Math.random() - 0.2
				},
				colors: ['#ff4d00', '#00ff00', '#0099ff', '#ff69b4', '#ffd700'],
				zIndex: 9999
			});
		}, 250);
	}
}