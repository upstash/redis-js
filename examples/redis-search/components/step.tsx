import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./code-block";
import { StepConfig } from "@/types/step";

interface StepProps {
  config: StepConfig;
  index: number;
}

export function Step({ config, index }: StepProps) {
  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Badge variant="outline" className="mt-1 shrink-0">
            {index}
          </Badge>
          <CardTitle className="text-xl">{config.title}</CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="text-base text-muted-foreground">
          {config.description}
        </div>
        
        {config.code && (
          <div>
            <h4 className="mb-2 font-medium text-sm text-muted-foreground">Code Example</h4>
            <CodeBlock code={config.code} />
          </div>
        )}
        
        {config.result && (
          <div>
            <h4 className="mb-2 font-medium text-sm text-muted-foreground">Try It</h4>
            <div className="rounded-lg border bg-card p-4">
              {config.result}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
