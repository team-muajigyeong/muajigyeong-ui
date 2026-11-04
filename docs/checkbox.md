# Checkbox 사용법

UI 0.6.0에서 기본 체크박스를 제공합니다.

```tsx
import Checkbox from "@muajigyeong/ui/checkbox";

<Checkbox label="동의" defaultChecked />
```

복합 라벨은 label prop을 생략하고 제목 요소를 aria-labelledby로, 설명 요소를 aria-describedby로 연결합니다. 바깥 label의 htmlFor를 input ID에 연결하면 라벨 클릭도 동작합니다.

```tsx
const id = useId();
const [checked, setChecked] = useState(false);

<label htmlFor={id}>
  <Checkbox
    id={id}
    checked={checked}
    onChange={value => setChecked(
      typeof value === "boolean" ? value : value.currentTarget.checked
    )}
    aria-labelledby={id + "-title"}
    aria-describedby={id + "-description"}
  />
  <strong id={id + "-title"}>서비스 소식 이메일</strong>
  <small id={id + "-description"}>새 기능과 주요 소식을 받습니다.</small>
</label>
```

기존 타입에서 onChange는 React input 이벤트 핸들러와 boolean 콜백의 교차 타입입니다. 위 핸들러는 두 입력 타입을 모두 수용하며, Checkbox 구현은 boolean을 전달합니다. checked와 defaultChecked는 함께 지정할 수 없습니다.

Storybook의 Checkbox 예제에서 초기 선택, 복합 라벨과 Docs의 수동 props 설명을 확인할 수 있습니다.
