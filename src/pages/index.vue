<script setup>
import {computed, ref} from 'vue';
import {useRouter} from 'vue-router';
import {AspectRatio} from 'radix-vue'

const router = useRouter();
import {ToggleGroupItem, ToggleGroupRoot} from 'radix-vue'
import {PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger} from 'radix-vue'
import draggable from "vuedraggable";


const toggleGroupItemClasses
    = 'hover:bg-green3 text-mauve11 data-[state=on]:bg-green6 data-[state=on]:text-violet12 flex h-[35px] w-[35px] items-center justify-center bg-white text-base leading-4 first:rounded-l last:rounded-r focus:z-10 focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none'

const new_card_information = ref({ratio: "2", fit_option: "object-cover"})

const addNewCard = () => {
  const ratio = new_card_information.value.ratio
  const image = new_card_information.value.src
  const fit = new_card_information.value.fit_option
  const lastListIndex = cards.value.length - 1;

  if(image === null){
    return
  }

  if (lastListIndex >= 0) {
    cards.value[lastListIndex].push({
      ratio: ratio,
      src: image,
      fit_option: fit,
      modal_open: false
    });
  } else {
    // 如果列表为空，则创建一个新的列表
    cards.value.push([{
      ratio: ratio,
      src: image,
      fit_option: fit,
      modal_open: false
    }]);
  }
  modal_open.value = false
  new_card_information.value = {ratio: "2", fit_option: "object-cover"}
};


function handleImageChange(item, event) {
  const file = event.target.files[0];
  if (file) {
    // 使用 FileReader 读取文件并设置到 item.src 中
    const reader = new FileReader();
    reader.onload = (e) => {
      item['src'] = e.target.result;
    };
    reader.readAsDataURL(file);
  }
}

const modal_open = ref(false)

const deleteCard = (cardToDelete) => {
  cardToDelete.modal_open = false
  // 遍历 cards 中的每个列表
  for (let i = 0; i < cards.value.length; i++) {
    const cardList = cards.value[i];

    // 查找要删除的卡片在当前列表中的索引
    const index = cardList.findIndex(card => card === cardToDelete);

    // 如果找到了要删除的卡片
    if (index !== -1) {
      // 从当前列表中移除卡片
      cardList.splice(index, 1);

      // 如果当前列表为空，则从 cards 中移除空列表
      if (cardList.length === 0) {
        cards.value.splice(i, 1);
      }

      // 结束循环，因为卡片已找到和删除
      break;
    }
  }
};

const drag = ref(false)

const dragOptions = computed(() => {
  return {
    animation: 200,
    group: "description",
    disabled: false,
    ghostClass: "ghost"
  };
})

const cards = ref([
  [
    {
      ratio: 2,
      src: "https://logo.stocklight.com/NASDAQ/BILI_original.png",
      fit_option: 'object-contain',
      modal_open: false
    },

    {
      ratio: 0.6,
      src: "src/assets/PixPin_2023-12-31_02-02-57.jpg",
      fit_option: 'object-cover',
      modal_open: false
    },
    {
      ratio: 0.9,
      src: "src/assets/PixPin_2023-12-31_02-03-17.jpg",
      fit_option: 'object-cover',
      modal_open: false
    },
  ],
  [
    {
      ratio: 2,
      src: "https://pointmetotheplane.boardingarea.com/wp-content/uploads/2019/01/apple-music-png-transparent-logo-1920x457.png",
      fit_option: 'object-contain',
      modal_open: false
    },
    {
      ratio: 0.6,
      src: "src/assets/PixPin_2023-12-31_02-03-28.jpg",
      fit_option: 'object-cover',
      modal_open: false
    },
    {
      ratio: 0.7,
      src: "src/assets/PixPin_2023-12-31_02-03-38.jpg",
      fit_option: 'object-cover',
      modal_open: false
    },
  ]
]);

const card_rows = ref(2)
const card_width = ref(300.0)

function updateColumnCount() {
  const currentColumnCount = cards.value.length;
  const newColumnCount = card_rows.value
  console.log("current:"+currentColumnCount)
  console.log("newColumnCount:"+newColumnCount)
  if (newColumnCount > currentColumnCount) {
    // Add new columns
    for (let i = currentColumnCount; i < newColumnCount; i++) {
      cards.value.push([
        {
          ratio: 2,
          src: "https://images.unsplash.com/photo-1535025183041-0991a977e25b?w=300&dpr=2&q=80",
          fit_option: 'object-cover',
          modal_open: false
        }
      ]);
    }
  } else if (newColumnCount < currentColumnCount) {

    cards.value.splice(newColumnCount);
  }
};
</script>

<template>

    <div class='absolute inset-0 blur-[118px] max-w-lg h-[800px] mx-auto sm:max-w-[1920px] sm:h-[1200px]' style="background: linear-gradient(106.89deg, rgba(192, 132, 252, 0.11) 15.73%, rgba(14, 165, 233, 0.41) 15.74%, rgba(232, 121, 249, 0.26) 56.49%, rgba(79, 70, 229, 0.4) 115.91%)"></div>


  <div class="flex flex-row h-full" >
    <draggable
        v-for="card_row in cards"
        class="flex flex-col h-full mr-2"
        :list="card_row"
        group="people"
        itemKey="id"
        :component-data="{
          tag: 'ul',
          type: 'transition-group',
          name: !drag ? 'flip-list' : null
        }"
        v-bind="dragOptions"
        @start="drag = true"
        @end="drag = false"
    >
      <template #item="{ element, index }">
        <div :class="
                element.fixed ? 'fa fa-anchor' : 'glyphicon glyphicon-pushpin'
              "
             @click="element.fixed = !element.fixed"
             aria-hidden="true">
          <PopoverRoot v-model:open="element['modal_open']">
            <PopoverTrigger
                :class="'w-['+ card_width +'px] overflow-hidden rounded-[16px]'">
              <AspectRatio :ratio="element['ratio']" >
                <img
                    :class="'h-full w-full bg-slate-50 ' + element['fit_option']"
                    :src="element['src']"
                    alt="alt"
                >
              </AspectRatio>
            </PopoverTrigger>
            <PopoverPortal>
              <PopoverContent
                  side="bottom"
                  :side-offset="5"
                  class="rounded p-5 w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.green7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
              >
                <div class="flex flex-col gap-2.5">
                  <p class="text-mauve12 text-[15px] leading-[19px] font-semibold mb-2.5">
                    卡片内容
                  </p>
                  <fieldset class="flex gap-5 items-center">
                    <label class="text-[13px] text-grass11 w-[75px]" for="ratio"> 宽高比(0.5-6) </label>
                    <input
                        id="ratio"
                        class="w-full inline-flex items-center justify-center flex-1 rounded px-2.5 text-[13px] leading-none text-grass11 shadow-[0_0_0_1px] shadow-green7 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
                        defaultValue="2.0"
                        v-model="element['ratio']"
                    >
                  </fieldset>
                  <fieldset class="flex gap-5 items-center">
                    <label class="text-[13px] text-grass11 w-[75px]" for="imageInput"> 图片 </label>
                    <input
                        id="imageInput"
                        type="file"
                        accept="image/*"
                        @change="handleImageChange(element, $event)"
                        class="w-full bg-white text-grass11 font-semibold hover:bg-white/90 shadow-sm inline-flex  items-center justify-center rounded-[4px] px-[15px] leading-none outline-none focus:shadow-[0_0_0_2px] focus:shadow-black transition-all"
                    >
                  </fieldset>
                  <fieldset class="flex gap-5 items-center">
                    <label class="text-[13px] text-grass11 w-[75px]" for="fitOption"> 图片样式 </label>

                    <ToggleGroupRoot v-model="element.fit_option" class="flex">
                      <ToggleGroupItem value="object-cover" aria-label="Toggle italic" :class="toggleGroupItemClasses">
                        <span class="mgc_fullscreen_2_line"></span>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="object-contain" aria-label="Toggle italic" :class="toggleGroupItemClasses">
                        <span class="mgc_fullscreen_exit_2_line"></span>
                      </ToggleGroupItem>
                    </ToggleGroupRoot>

                  </fieldset>
                  <div
                      class="text-red11 bg-red4 hover:bg-red5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
                      @click="deleteCard(element)">
                    <span class="mgc_delete_line"></span>
                  </div>

                </div>
                <PopoverClose
                    class="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-grass11 absolute top-[5px] right-[5px] hover:bg-green4 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
                    aria-label="Close"
                >
                  <span class="mgc_close_line" style="font-size: 16px"></span>
                </PopoverClose>
                <PopoverArrow class="fill-white"/>
              </PopoverContent>
            </PopoverPortal>
          </PopoverRoot>
        </div>
      </template>
    </draggable>
  </div>

<!-- 编辑列数 -->
  <PopoverRoot >
    <PopoverTrigger
        class="mr-8 rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-grass11 bg-white shadow-[0_2px_10px] shadow-blackA7 hover:bg-green3 focus:shadow-[0_0_0_2px] focus:shadow-black cursor-default outline-none"
        aria-label="Update dimensions"
    >
      <span class="mgc_edit_4_line" style="font-size: 16px"></span>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
          side="bottom"
          :side-offset="5"
          class="rounded p-5 w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.green7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
      >
        <div class="flex flex-col gap-2.5">
          <p class="text-mauve12 text-[15px] leading-[19px] font-semibold mb-2.5">
            编辑
          </p>
          <fieldset class="flex gap-5 items-center">
            <label class="text-[13px] text-grass11 w-[75px]" for="ratio"> 列数 </label>
            <input
                id="ratio"
                class="w-full inline-flex items-center justify-center flex-1 rounded px-2.5 text-[13px] leading-none text-grass11 shadow-[0_0_0_1px] shadow-green7 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
                defaultValue="2.0"
                v-model="card_rows"
            >
          </fieldset>
          <fieldset class="flex gap-5 items-center">
            <label class="text-[13px] text-grass11 w-[75px]" for="width"> 图片宽度(px) </label>
            <input
                id="ratio"
                class="w-full inline-flex items-center justify-center flex-1 rounded px-2.5 text-[13px] leading-none text-grass11 shadow-[0_0_0_1px] shadow-green7 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
                defaultValue="2.0"
                v-model="card_width"
            >
          </fieldset>

          <div
              class="text-grass11 bg-grass4 hover:bg-grass5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
              @click="updateColumnCount()">
            <span class="mgc_save_2_line"></span>
          </div>
        </div>
        <PopoverClose
            class="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-grass11 absolute top-[5px] right-[5px] hover:bg-green4 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
            aria-label="Close"
        >
          <span class="mgc_close_line" style="font-size: 16px"></span>
        </PopoverClose>
        <PopoverArrow class="fill-white"/>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>

  <PopoverRoot v-model:open="modal_open">
    <PopoverTrigger
        class="rounded-full w-[35px] h-[35px] inline-flex items-center justify-center text-grass11 bg-white shadow-[0_2px_10px] shadow-blackA7 hover:bg-green3 focus:shadow-[0_0_0_2px] focus:shadow-black cursor-default outline-none"
        aria-label="Update dimensions"
    >
      <span class="mgc_add_line" style="font-size: 16px"></span>
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
          side="bottom"
          :side-offset="5"
          class="rounded p-5 w-[260px] bg-white shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)] focus:shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2),0_0_0_2px_theme(colors.green7)] will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slideDownAndFade data-[state=open]:data-[side=right]:animate-slideLeftAndFade data-[state=open]:data-[side=bottom]:animate-slideUpAndFade data-[state=open]:data-[side=left]:animate-slideRightAndFade"
      >
        <div class="flex flex-col gap-2.5">
          <p class="text-mauve12 text-[15px] leading-[19px] font-semibold mb-2.5">
            卡片内容
          </p>
          <fieldset class="flex gap-5 items-center">
            <label class="text-[13px] text-grass11 w-[75px]" for="ratio"> 宽高比(0.5-6) </label>
            <input
                id="ratio"
                class="w-full inline-flex items-center justify-center flex-1 rounded px-2.5 text-[13px] leading-none text-grass11 shadow-[0_0_0_1px] shadow-green7 h-[25px] focus:shadow-[0_0_0_2px] focus:shadow-green8 outline-none"
                defaultValue="2.0"
                v-model="new_card_information.ratio"
            >
          </fieldset>
          <fieldset class="flex gap-5 items-center">
            <label class="text-[13px] text-grass11 w-[75px]" for="imageInput"> 图片 </label>
            <input
                id="imageInput"
                type="file"
                accept="image/*"
                @change="handleImageChange(new_card_information, $event)"
                class="w-full bg-white text-grass11 font-semibold hover:bg-white/90 shadow-sm inline-flex  items-center justify-center rounded-[4px] px-[15px] leading-none outline-none focus:shadow-[0_0_0_2px] focus:shadow-black transition-all"
            >
          </fieldset>
          <fieldset class="flex gap-5 items-center">
            <label class="text-[13px] text-grass11 w-[75px]" for="fitOption"> 图片样式 </label>

            <ToggleGroupRoot v-model="new_card_information.fit_option" class="flex">
              <ToggleGroupItem value="object-cover" aria-label="Toggle italic" :class="toggleGroupItemClasses">
                <span class="mgc_fullscreen_2_line"></span>
              </ToggleGroupItem>
              <ToggleGroupItem value="object-contain" aria-label="Toggle italic" :class="toggleGroupItemClasses">
                <span class="mgc_fullscreen_exit_2_line"></span>
              </ToggleGroupItem>
            </ToggleGroupRoot>

          </fieldset>
          <div
              class="text-grass11 bg-grass4 hover:bg-grass5 focus:shadow-red7 inline-flex h-[35px] items-center justify-center rounded-[4px] px-[15px] font-semibold leading-none outline-none focus:shadow-[0_0_0_2px]"
              @click="addNewCard()">
            <span class="mgc_add_line"></span>
          </div>
        </div>
        <PopoverClose
            class="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center text-grass11 absolute top-[5px] right-[5px] hover:bg-green4 focus:shadow-[0_0_0_2px] focus:shadow-green7 outline-none cursor-default"
            aria-label="Close"
        >
          <span class="mgc_close_line" style="font-size: 16px"></span>
        </PopoverClose>
        <PopoverArrow class="fill-white"/>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>


</template>

<style scoped>
.flip-list-move {
  transition: transform 0.5s;
}

.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #c8ebfb;
}
</style>
