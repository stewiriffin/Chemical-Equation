import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { CheckCircle2 } from "lucide-react"
import { Step } from "@/types/chemistry"

interface StepsExplanationProps {
  steps: Step[]
}

export function StepsExplanation({ steps }: StepsExplanationProps) {
  return (
    <Card className="transition-all hover:shadow-glow-md hover:border-primary/50">
      <CardHeader>
        <CardTitle>Step-by-Step Explanation</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {steps.map((step, index) => (
            <AccordionItem key={index} value={`step-${index}`}>
              <AccordionTrigger className="text-left">
                <div className="flex items-center gap-2">
                  {index === steps.length - 1 && (
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                  )}
                  <span>Step {index + 1}: {step.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {step.description}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  )
}
