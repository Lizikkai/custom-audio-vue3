<template>
    <div class="audio">
        <div class="audio-wrap">
            <div class="audio-wrap-back" @click="go('back')" :class="{ stop: !currentTime }"></div>
            <div class="audio-wrap-start" @click="handleTogglePlay" :class="{ pause: isPlaying }"></div>
            <div class="audio-wrap-forward" @click="go('forward')"></div>
        </div>
        <div class="audio-track">
            <div class="audio-track-process" @click="hadnleSeekerForward" @mousedown="handleMouseDown"
                :class="{ 'is-dragging': isDragging }">
                <div class="audio-track-process-seeker"
                    :style="{ width: `${isDragging ? dragProgress : percentComplete}%` }">
                    <div class="audio-track-process-seeker-circle" v-if="currentTime"
                        @mousedown.prevent="handleCircleMouseDown"></div>
                </div>
                <div class="audio-track-process-buffered" :style="{ width: `${bufferedComplete}%` }"></div>
            </div>
            <div class="audio-track-time">
                <span>{{ currentTimeTransform }}</span>
                <span class="audio-track-time-total">/</span>
                <span class="audio-track-time-total">{{ durationTransform }}</span>
            </div>
        </div>
        <div class="audio-volume" @click="toggleVolumeSlider" ref="volumeRef">
            <div class="audio-volume-icon" :class="{ 'muted': volume === 0 }"></div>
            <div class="audio-volume-slider" v-show="showVolumeSlider">
                <div class="audio-volume-slider-track" @click="handleVolumeClick">
                    <div class="audio-volume-slider-fill" :style="{ height: `${volume}%` }"></div>
                    <div class="audio-volume-slider-thumb" :style="{ bottom: `${volume}%` }"
                        @mousedown="handleVolumeMouseDown"></div>
                </div>
            </div>
        </div>
        <div class="audio-speed" @click="toggleSpeedDropdown" ref="speedDropdownRef">
            <div class="audio-speed-show">
                {{ `${playbackRate}x` }}
                <div class="audio-speed-show-arrow" :class="{ 'rotated': showSpeedDropdown }"></div>
            </div>
            <div class="audio-speed-dropdown" v-show="showSpeedDropdown">
                <div class="audio-speed-dropdown-item" v-for="speed in speedOptions" :key="speed"
                    :class="{ 'active': speed === playbackRate }" @click.stop="selectSpeed(speed)">
                    {{ speed }}x
                </div>
            </div>
        </div>
    </div>
    <audio ref="audioFile" preload="auto" :src="audioUrl"></audio>
</template>

<script setup lang="ts">
import { ref, computed, watch, unref, onMounted, onUnmounted } from 'vue'
import { transformSecondToTime } from '../utils'

defineProps<{
    /** 音频路径 */
    audioUrl: string
}>()


const isPlaying = ref<boolean>(false)
const audioFile = ref<HTMLAudioElement>()
/** 音频总时长 */
const duration = ref<number>(0)
/** 音频总时长转mm:ss */
const durationTransform = ref<string>('00:00')
/** 音频总时长秒数 整数 */
const durationSeconds = ref<number>(0)
/** 音频当前播放进度 */
const currentTime = ref<number>(0)
/** 音频当前已播放时长 秒数整 */
const currentTimeSeconds = ref<number>(0)
/** 音频播放倍速 */
const playbackRate = ref<number>(1)
/** 音频当前已播放时长转mm:ss */
const currentTimeTransform = ref<string>('00:00')

/** 缓冲的时长 */
const buffered = ref<number>(0)

/** 拖动相关状态 */
const isDragging = ref<boolean>(false)
const dragProgress = ref<number>(0)
const dragStartX = ref<number>(0)
/** 音量 默认满格 */
const volume = ref<number>(100)

/** 音量滑块相关 */
const showVolumeSlider = ref<boolean>(false)
const volumeRef = ref<HTMLElement>()
const isVolumeMouseDown = ref<boolean>(false)

/** 倍速下拉菜单相关 */
const showSpeedDropdown = ref<boolean>(false)
const speedDropdownRef = ref<HTMLElement>()
const speedOptions = [0.5, 1, 1.5, 2]



onMounted(() => {
    if (audioFile.value) {
        // 设置初始音量
        audioFile.value.volume = volume.value / 100

        // 监听元数据加载完成事件
        audioFile.value.addEventListener('loadedmetadata', () => {
            duration.value = audioFile.value?.duration || 0
            durationSeconds.value = parseInt(duration.value.toString())
            durationTransform.value = transformSecondToTime(duration.value)
            console.log('音频时长:', duration.value, transformSecondToTime(duration.value), durationSeconds.value)
        })

        // 需要添加一个监听播放器的ended事件
        audioFile.value.addEventListener('ended', () => {
            // 播放结束后，将当前时间重置为0
            currentTime.value = 0
            currentTimeSeconds.value = parseInt(currentTime.value.toString())
            currentTimeTransform.value = transformSecondToTime(currentTime.value)
        })

        // 监听播放进度更新
        audioFile.value.addEventListener('timeupdate', update)

        audioFile.value.addEventListener('pause', () => {
            isPlaying.value = false
        })

        audioFile.value.addEventListener('play', () => {
            isPlaying.value = true
        })

        // 如果音频已经加载了元数据，直接获取时长
        if (audioFile.value.readyState >= 1) {
            duration.value = audioFile.value.duration
        }
    }

    // 添加点击外部关闭下拉菜单的事件监听器
    document.addEventListener('click', handleClickOutside)
})

// 组件卸载时移除事件监听器
onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
})
/** 回退15秒/快进15秒 */
function go(type: 'back' | 'forward') {
    if (!duration.value) return
    if (type === 'back') {
        if (!currentTime.value) return
        if (audioFile.value) {
            audioFile.value.currentTime = audioFile.value.currentTime - 15
        }
    } else {
        if (audioFile.value) {
            audioFile.value.currentTime = audioFile.value.currentTime + 15
        }
    }
    update()
}
function handleTogglePlay() {
    if (!duration.value) return
    isPlaying.value = !isPlaying.value
}

/** 切换倍速下拉菜单显示 */
function toggleSpeedDropdown() {
    if (showSpeedDropdown.value) {
        showSpeedDropdown.value = false
    }
    showSpeedDropdown.value = !showSpeedDropdown.value
}

/** 选择倍速 */
function selectSpeed(speed: number) {
    if (audioFile.value) {
        playbackRate.value = speed
        audioFile.value.playbackRate = speed
    }
    showSpeedDropdown.value = false
}

/** 点击外部关闭下拉菜单 */
function handleClickOutside(event: MouseEvent) {
    if (speedDropdownRef.value && !speedDropdownRef.value.contains(event.target as Node)) {
        showSpeedDropdown.value = false
    }
    if (volumeRef.value && !volumeRef.value.contains(event.target as Node)) {
        showVolumeSlider.value = false
    }
}

/** 切换音量滑块显示 */
function toggleVolumeSlider(event: MouseEvent) {
    event.stopPropagation()
    if (showSpeedDropdown.value) {
        showSpeedDropdown.value = false
    }
    showVolumeSlider.value = !showVolumeSlider.value
}

/** 处理音量滑块点击 */
function handleVolumeClick(event: MouseEvent) {
    event.stopPropagation()
    const slider = event.currentTarget as HTMLElement
    const rect = slider.getBoundingClientRect()
    const clickY = event.clientY - rect.top
    const sliderHeight = rect.height
    const newVolume = Math.max(0, Math.min(100, 100 - (clickY / sliderHeight) * 100))

    volume.value = Math.round(newVolume)
    updateAudioVolume()
}

/** 处理音量滑块拖拽开始 */
function handleVolumeMouseDown(event: MouseEvent) {
    event.stopPropagation()
    event.preventDefault()
    isVolumeMouseDown.value = true

    const handleMouseMove = (e: MouseEvent) => {
        if (!isVolumeMouseDown.value) return

        const slider = volumeRef.value?.querySelector('.audio-volume-slider-track') as HTMLElement
        if (!slider) return

        const rect = slider.getBoundingClientRect()
        const moveY = e.clientY - rect.top
        const sliderHeight = rect.height
        const newVolume = Math.max(0, Math.min(100, 100 - (moveY / sliderHeight) * 100))

        volume.value = Math.round(newVolume)
        updateAudioVolume()
    }

    const handleMouseUp = () => {
        isVolumeMouseDown.value = false
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
}

/** 更新音频音量 */
function updateAudioVolume() {
    if (audioFile.value) {
        audioFile.value.volume = volume.value / 100
    }
}

watch(() => isPlaying.value, (newValue) => {
    if (newValue) {
        audioFile.value && audioFile.value.play()
    } else {
        audioFile.value && audioFile.value.pause()
    }
})
/** 当前播放的进度 */
const percentComplete = computed(() => {
    if (unref(currentTimeSeconds) && unref(durationSeconds)) {
        return (unref(currentTimeSeconds) / unref(durationSeconds)) * 100
    }
    return 0
})
/** 预先缓冲的进度 */
const bufferedComplete = computed(() => {
    if (unref(durationSeconds)) {
        return (unref(buffered) / unref(durationSeconds)) * 100
    }
    return 0
})
/** 更新的当前播放进度 */
function update() {
    currentTime.value = audioFile.value?.currentTime || 0
    currentTimeSeconds.value = parseInt(currentTime.value.toString())
    currentTimeTransform.value = transformSecondToTime(currentTime.value)
    buffered.value = audioFile.value?.buffered?.end(0) || 0
}

/** 点击进度条跳转 */
function hadnleSeekerForward(e: MouseEvent) {
    if (audioFile.value && duration.value) {
        const progressBar = e.currentTarget as HTMLElement
        const rect = progressBar.getBoundingClientRect()

        // 计算点击位置相对于进度条的百分比
        const clickX = e.clientX - rect.left
        const progressPercent = Math.max(0, Math.min(1, clickX / rect.width))

        // 设置音频播放位置
        const targetTime = progressPercent * duration.value
        audioFile.value.currentTime = targetTime
        isPlaying.value = true
    }
}

// 拖动处理函数
const handleMouseDown = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
        // 点击进度条背景，直接跳转
        hadnleSeekerForward(e)
    }
}

const handleCircleMouseDown = (e: MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    isDragging.value = true
    dragStartX.value = e.clientX
    dragProgress.value = percentComplete.value

    // 添加全局事件监听器
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)

    // 防止文本选择
    document.body.style.userSelect = 'none'
}

const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return

    const progressBar = document.querySelector('.audio-track-process') as HTMLElement
    if (!progressBar) return

    const rect = progressBar.getBoundingClientRect()
    const progressPercent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))

    dragProgress.value = progressPercent * 100
}

const handleMouseUp = () => {
    if (!isDragging.value) return

    // 应用拖动结果
    if (audioFile.value && duration.value > 0) {
        const targetTime = (dragProgress.value / 100) * duration.value
        audioFile.value.currentTime = targetTime

        // 立即更新currentTime相关的响应式变量，避免跳动
        currentTime.value = targetTime
        currentTimeSeconds.value = parseInt(targetTime.toString())
        currentTimeTransform.value = transformSecondToTime(targetTime)
    }

    // 清理拖动状态
    isDragging.value = false

    // 移除全局事件监听器
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)

    // 恢复文本选择
    document.body.style.userSelect = ''
}


</script>

<style scoped lang="scss">
.audio {
    font-family: 'FZLanTingHeiS-R-GB', sans-serif;
    font-size: 12px;
    width: 100%;
    // height: 64px;
    // border-radius: 10px;
    // background: #fff;
    // box-shadow: 0px 0px 20px 1px rgba(89, 104, 145, 0.2);
    // padding: 20px 16px;
    display: flex;
    align-items: center;

    &-wrap {
        display: flex;
        align-items: center;
        gap: 12px;

        &-back {
            width: 16px;
            height: 16px;
            background: url('../assets/meeting-back-15s-actived.png') no-repeat center center;
            background-size: contain;

            &.stop {
                background: url('../assets/meeting-back-15s-unactived.png') no-repeat center center;
                background-size: contain;
            }
        }

        &-start {
            width: 28px;
            height: 28px;
            background: url('../assets/playcircle-fill.png') no-repeat center center;
            background-size: contain;

            &.pause {
                background: url('../assets/pausecircle-fill.png') no-repeat center center;
                background-size: contain;
            }

            &.none {
                cursor: not-allowed;
            }
        }

        &-forward {
            width: 16px;
            height: 16px;
            background: url('../assets/meeting-forward-15s-actived.png') no-repeat center center;
            background-size: contain;
        }
    }

    &-track {
        display: flex;
        align-items: center;
        margin-left: 20px;
        flex: 1;

        &-time {
            &-total {
                color: #959596;
            }
        }

        &-process {
            flex: 1;
            background-color: #DDDDDD;
            height: 4px;
            border-radius: 2px;
            margin-right: 16px;
            position: relative;
            cursor: pointer;
            transition: height 0.2s ease;

            &.is-dragging {
                height: 6px;
                margin-top: -1px;
                margin-bottom: -1px;
            }

            &-seeker {
                bottom: 0;
                left: 0;
                position: absolute;
                top: 0;
                z-index: 20;
                border-radius: 2px;
                background-color: #B7D8FF;

                &-circle {
                    display: block;
                    position: absolute;
                    top: 50%;
                    right: -6px;
                    /* 让circle定位在进度条的最右端 */
                    transform: translateY(-50%);
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: #387FFF;
                    box-shadow: 0 2px 4px rgba(56, 127, 255, 0.3);
                    cursor: pointer;
                    transition: all 0.2s ease;

                    &:hover {
                        width: 14px;
                        height: 14px;
                        right: -7px;
                        box-shadow: 0 3px 6px rgba(56, 127, 255, 0.4);
                    }
                }
            }

            &-buffered {
                bottom: 0;
                left: 0;
                position: absolute;
                top: 0;
                z-index: 10;
                background-color: transparent;
            }
        }
    }

    &-volume {
        position: relative;
        display: flex;
        align-items: center;
        cursor: pointer;

        &-icon {
            margin-left: 12px;
            width: 20px;
            height: 20px;
            background: url('../assets/volume.png') no-repeat center center;
            background-size: contain;
            transition: opacity 0.2s ease;

            &.muted {
                opacity: 0.5;
            }
        }

        &-slider {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-30%);
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid #e5e5e5;
            padding: 12px 8px;
            z-index: 1000;

            &-track {
                width: 6px;
                height: 80px;
                background-color: #DDDDDD;
                border-radius: 3px;
                position: relative;
                cursor: pointer;
                margin: 0 auto;

                &:hover {
                    background-color: #CCCCCC;
                }
            }

            &-fill {
                position: absolute;
                bottom: 0;
                left: 0;
                width: 100%;
                background-color: #387FFF;
                border-radius: 3px;
                transition: height 0.1s ease;
            }

            &-thumb {
                position: absolute;
                left: 50%;
                transform: translateX(-50%) translateY(50%);
                width: 12px;
                height: 12px;
                background-color: #387FFF;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(56, 127, 255, 0.3);
                transition: all 0.2s ease;

                &:hover {
                    width: 14px;
                    height: 14px;
                    box-shadow: 0 3px 6px rgba(56, 127, 255, 0.4);
                }
            }
        }
    }

    &-speed {
        padding-left: 12px;
        padding-right: 12px;
        position: relative;
        font-size: 14px;
        cursor: pointer;

        &-show {
            display: flex;
            align-items: center;
            gap: 4px;

            &-arrow {
                width: 10px;
                height: 5px;
                background: url('../assets/meeting-switch-speed-arrow.png') no-repeat center center;
                background-size: contain;
                transition: transform 0.2s ease;

                &.rotated {
                    transform: rotate(180deg);
                }
            }
        }

        &-dropdown {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            margin-top: 8px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            border: 1px solid #e5e5e5;
            z-index: 1000;
            min-width: 60px;
            overflow: hidden;

            &-item {
                padding: 8px 16px;
                font-size: 14px;
                color: #333;
                cursor: pointer;
                transition: all 0.2s ease;
                text-align: center;

                &:hover {
                    background-color: #f5f5f5;
                }

                &.active {
                    background-color: #387FFF;
                    color: #fff;

                    &:hover {
                        background-color: #2968e6;
                    }
                }

                &:not(:last-child) {
                    border-bottom: 1px solid #f0f0f0;
                }
            }
        }

        &-wrap {
            display: flex;
            flex-direction: column;

            &-item {
                min-height: 32px;
            }
        }
    }
}
</style>