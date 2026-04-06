# 图片模块实现方案

**版本**: v1.1.0  
**日期**: 2026-04-06  
**状态**: 已更新  

---

## 1. 技术设计

### 1.1 工作流程

```
创作者编写小说内容
       ↓
需要背景图时运行 Skill
       ↓
./skills/qwen-image/generate-image.sh "<prompt>" <model>
       ↓
API 返回临时 URL（24 小时有效）
       ↓
下载图片到本地项目目录
       ↓
在 JSON 中引用本地路径
```

### 1.2 图片生成脚本

```bash
#!/bin/bash
# skills/qwen-image/generate-image.sh

# 参数
PROMPT="$1"
MODEL="${2:-qwen-image-2.0-pro}"
SIZE="${3:-2048*2048}"
N="${4:-1}"

# 调用阿里云百炼 API（千问系列 - 同步）
curl --location \
  'https://dashscope.aliyuncs.com/api/v1/services/aigc/multimodal-generation/generation' \
  --header 'Content-Type: application/json' \
  --header "Authorization: Bearer $DASHSCOPE_API_KEY" \
  --data "{
    \"model\": \"$MODEL\",
    \"input\": {
      \"messages\": [{
        \"role\": \"user\",
        \"content\": [{\"text\": \"$PROMPT\"}]
      }]
    },
    \"parameters\": {
      \"size\": \"$SIZE\",
      \"n\": $N,
      \"watermark\": false,
      \"prompt_extend\": true
    }
  }"
```

### 1.3 图片下载与存储

```bash
# 下载示例
IMAGE_URL="https://dashscope-xxx.oss-accelerate.aliyuncs.com/xxx.png"
DEST_PATH="public/data/doomsday/images/backgrounds/street-01.png"

curl -o "$DEST_PATH" "$IMAGE_URL"
```

---

## 2. 文件结构

```
project/
├── skills/
│   └── qwen-image/
│       ├── SKILL.md              # Skill 主文件
│       ├── generate-image.sh     # 图片生成脚本
│       └── evals/
│           └── evals.json        # 测试用例
├── public/
│   └── data/
│       └── <小说名>/
│           └── images/
│               ├── cover.jpg
│               └── backgrounds/  # 生成的背景图存储目录
└── src/
    └── composables/
        └── useImageGeneration.ts # 可选：封装下载逻辑
```

---

## 3. 实现步骤

### 3.1 准备 Skill

1. 配置环境变量 `DASHSCOPE_API_KEY`
2. 测试 `generate-image.sh` 脚本
3. 验证 API 调用正常

### 3.2 生成图片

1. 编写图片提示词（结合小说 tags）
2. 运行 Skill 生成图片
3. 获取返回的图像 URL

### 3.3 下载并存储

1. 使用 curl 下载图片到本地
2. 保存到 `public/data/<小说名>/images/backgrounds/`
3. 使用描述性文件名

### 3.4 在 JSON 中引用

```json
{
  "background": "images/backgrounds/street-ruined-01.png"
}
```

---

## 4. 错误处理

### 4.1 API 错误

| 错误码 | 原因 | 解决方案 |
|--------|------|----------|
| DataInspectionFailed | 提示词触发审核 | 修改敏感内容 |
| Throttling / 429 | 限流 | 降低频率，稍后重试 |
| URL 失效 | 超过 24 小时 | 重新生成 |

### 4.2 降级方案

- 生图失败 → 显示默认背景色
- 图片不存在 → 显示占位图
- 网络错误 → 提供重试按钮

---

## 5. 最佳实践

### 5.1 提示词技巧

- **具体详细**: 描述主体、场景、风格、光照
- **结构化**: 主体 + 场景 + 风格 + 细节
- **结合 tags**: 带上小说的基础设定

### 5.2 图片管理

- 及时下载：URL 24 小时后失效
- 规范命名：`<场景>-<描述>-<序号>.png`
- 分类存储：按小说和场景类型组织

---

## 6. 测试计划

### 6.1 功能测试

- [ ] Skill 调用正常
- [ ] 图片生成成功
- [ ] 下载并存储正确
- [ ] JSON 引用正常显示

### 6.2 错误处理测试

- [ ] API 错误提示
- [ ] URL 过期处理
- [ ] 文件缺失降级
