<script lang="ts">
	interface Props {
		size?: number | string;
		strokeWidth?: number | string;
		children: any;
		[key: string]: any;
	}

	let { size = 24, strokeWidth = 2, children, ...rest }: Props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={strokeWidth}
	stroke-linecap="round"
	stroke-linejoin="round"
	{...rest}
>
	{@render children()}
</svg>
