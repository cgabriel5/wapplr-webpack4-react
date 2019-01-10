function hello_greeting() {
	const words = ["Hello", "world!"];
	const greeting = () => console.log(...words);
	greeting();
}

export { hello_greeting };
