import "../../global.css";
import { useState } from "react";
import { ScrollView } from "react-native";
import {
  Text,
  Button,
  Input,
  Badge,
  Switch,
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  Tabs,
  TabPanel,
  Accordion,
  AccordionItem,
} from "../components";
import { LucideCheck, LucideEye, LucideSearch, LucideMail } from "lucide-react-native";

const tabs = [
  { key: "tab1", label: "Tab 1" },
  { key: "tab2", label: "Tab 2" },
  { key: "tab3", label: "Tab 3" },
];

export default function Index() {
  const [switchOn, setSwitchOn] = useState(false);
  const [activeTab, setActiveTab] = useState("tab1");

  return (
    <ScrollView className="flex-1 bg-white p-4 pt-12 gap-6">
      <Text variant="heading">Componentes</Text>

      {/* Text */}
      <Card>
        <CardHeader>
          <Text variant="subheading">Text</Text>
        </CardHeader>
        <CardContent className="gap-2">
          <Text variant="heading">Heading</Text>
          <Text variant="subheading">Subheading</Text>
          <Text variant="body">Body text</Text>
          <Text variant="caption">Caption</Text>
          <Text variant="label">Label</Text>
        </CardContent>
      </Card>

      {/* Button */}
      <Card>
        <CardHeader>
          <Text variant="subheading">Button</Text>
        </CardHeader>
        <CardContent className="gap-3">
          <Button variant="primary" size="lg">Primary</Button>
          <Button variant="secondary" size="md">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button loading>Carregando</Button>
          <Button disabled>Desabilitado</Button>
        </CardContent>
      </Card>

      {/* Input */}
      <Card>
        <CardHeader>
          <Text variant="subheading">Input</Text>
        </CardHeader>
        <CardContent className="gap-4">
          <Input label="Email" placeholder="email@exemplo.com" />
          <Input label="Senha" placeholder="••••••" secureTextEntry />
          <Input
            label="Com ícone esquerda"
            placeholder="Buscar..."
            leftIcon={<Text className="text-muted-foreground"><LucideSearch /></Text>}
          />
          <Input
            label="Com ícone direita"
            placeholder="Senha"
            secureTextEntry
            rightIcon={<Text className="text-muted-foreground"><LucideEye /></Text>}
          />
          <Input
            label="Com dois ícones"
            placeholder="Email"
            leftIcon={<Text className="text-muted-foreground"><LucideMail /></Text>}
            rightIcon={<Text className="text-muted-foreground"><LucideCheck color={"green"} /></Text>}
          />
          <Input label="Com erro" placeholder="..." error="Campo obrigatório" />
        </CardContent>
      </Card>

      {/* Badge */}
      <Card>
        <CardHeader>
          <Text variant="subheading">Badge</Text>
        </CardHeader>
        <CardContent className="flex-row flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="accent">Accent</Badge>
        </CardContent>
      </Card>

      {/* Switch */}
      <Card>
        <CardHeader>
          <Text variant="subheading">Switch</Text>
        </CardHeader>
        <CardContent className="gap-3">
          <Switch value={switchOn} onValueChange={setSwitchOn} label="Notificações" />
          <Text variant="caption">Estado: {switchOn ? "ligado" : "desligado"}</Text>
          <Switch value={false} onValueChange={() => {}} label="Sem ação" />
        </CardContent>
      </Card>

      {/* Tabs */}
      <Card>
        <CardHeader>
          <Text variant="subheading">Tabs</Text>
        </CardHeader>
        <CardContent>
          <Tabs tabs={tabs} activeKey={activeTab} onChange={setActiveTab} />
          <TabPanel
            activeKey={activeTab}
            panels={{
              tab1: <Text>Conteúdo da Tab 1</Text>,
              tab2: <Text>Conteúdo da Tab 2</Text>,
              tab3: <Text>Conteúdo da Tab 3</Text>,
            }}
          />
        </CardContent>
      </Card>

      {/* Accordion */}
      <Card>
        <CardHeader>
          <Text variant="subheading">Accordion</Text>
        </CardHeader>
        <CardContent>
          <Accordion>
            <AccordionItem title="O que é React Native?">
              <Text variant="body">
                React Native é um framework que permite criar apps nativos usando React e JavaScript.
              </Text>
            </AccordionItem>
            <AccordionItem title="O que é Expo?" defaultOpen>
              <Text variant="body">
                Expo é um conjunto de ferramentas que facilita o desenvolvimento com React Native.
              </Text>
            </AccordionItem>
            <AccordionItem title="O que é NativeWind?">
              <Text variant="body">
                NativeWind permite usar classes do Tailwind CSS em React Native.
              </Text>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      {/* Card footer */}
      <Card>
        <CardContent>
          <Text>Card com footer</Text>
        </CardContent>
        <CardFooter>
          <Button variant="outline" size="sm">Cancelar</Button>
          <Button size="sm">Confirmar</Button>
        </CardFooter>
      </Card>
    </ScrollView>
  );
}
