<script lang="ts">
	import 'swiper/css';
	import 'swiper/css/pagination';
	import 'swiper/css/navigation';
	import { Pagination, Navigation } from 'swiper';
	import { Swiper, SwiperSlide } from 'swiper/svelte';

	export let images: string[];
</script>

<Swiper
	slidesPerView={1}
	loop={images.length > 1 ? true : false}
	pagination={{
		clickable: true
	}}
	navigation={images.length > 1 ? true : false}
	modules={images.length > 1 ? [Pagination, Navigation] : []}
	class="mySwiper"
>
	{#each Object.entries(images) as [index, image]}
		<SwiperSlide>
			<img class="responsive" src={image} alt="slide # {index + 1}" />
		</SwiperSlide>
	{/each}
</Swiper>

<style>
</style>
