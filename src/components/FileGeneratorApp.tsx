import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function FileGeneratorApp() {
  const [storeName, setStoreName] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<"一般版" | "候位版" | "橘角版" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [options, setOptions] = useState({
    a4文宣: false,
    qrcode: false,
    立牌卡: false
  });

  const handleVersionChange = (value: string) => {
    setSelectedVersion(value as "一般版" | "候位版" | "橘角版");
  };

  const handleOptionChange = (option: keyof typeof options, checked: boolean) => {
    setOptions(prev => ({
      ...prev,
      [option]: checked
    }));
  };

  const handleSubmit = async () => {
    if (!storeName.trim()) {
      toast.error("請輸入店名");
      return;
    }

    if (!selectedVersion) {
      toast.error("請選擇版本類型");
      return;
    }

    setIsGenerating(true);

    try {
      const payload = {
        name: `店名:${storeName}`,
        version: selectedVersion,
        options: options
      };

      // API call to webhook
      const response = await fetch("https://grouper-brief-monthly.ngrok-free.app/webhook/callMeBack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error("提交失敗");
      }

      toast.success("提交成功！");
    } catch (error) {
      toast.error("提交過程中發生錯誤，請重試");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2 text-emerald-600">
            叫叫我圖檔生成系統
          </h1>
          <p className="text-muted-foreground text-lg">
            立即生成想要的圖檔傳至信箱
          </p>
        </div>

        {/* Input Section */}
        <div className="space-y-6">
          <Card className="shadow-card border-border/50 bg-card/95 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-teal-600">店家資訊輸入</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="storeName" className="text-foreground font-medium">
                  請輸入名稱
                </Label>
                <Input
                  id="storeName"
                  value={storeName}
                  onChange={e => setStoreName(e.target.value)}
                  placeholder="請輸入店家名稱"
                  className="bg-input border-input-border focus:ring-ring"
                  disabled={isGenerating}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 版本選擇 */}
                <div className="space-y-4">
                  <Label className="text-foreground font-medium">版本選擇:</Label>
                  <RadioGroup
                    value={selectedVersion || ""}
                    onValueChange={handleVersionChange}
                    disabled={isGenerating}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="一般版" id="general" />
                      <Label htmlFor="general" className="text-foreground cursor-pointer">
                        一般版
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="候位版" id="waiting" />
                      <Label htmlFor="waiting" className="text-foreground cursor-pointer">
                        候位版
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="橘角版" id="orange" />
                      <Label htmlFor="orange" className="text-foreground cursor-pointer">
                        橘角版
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* 製作項目 */}
                <div className="space-y-4">
                  <Label className="text-foreground font-medium">製作項目:</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="a4文宣"
                        checked={options.a4文宣}
                        onCheckedChange={checked => handleOptionChange("a4文宣", checked as boolean)}
                        disabled={isGenerating}
                      />
                      <Label htmlFor="a4文宣" className="text-foreground cursor-pointer">
                        A4文宣
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="qrcode"
                        checked={options.qrcode}
                        onCheckedChange={checked => handleOptionChange("qrcode", checked as boolean)}
                        disabled={isGenerating}
                      />
                      <Label htmlFor="qrcode" className="text-foreground cursor-pointer">
                        Qrcode
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="立牌卡"
                        checked={options.立牌卡}
                        onCheckedChange={checked => handleOptionChange("立牌卡", checked as boolean)}
                        disabled={isGenerating}
                      />
                      <Label htmlFor="立牌卡" className="text-foreground cursor-pointer">
                        立牌卡
                      </Label>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={!storeName.trim() || !selectedVersion || isGenerating}
                size="lg"
                className="w-full bg-gradient-primary text-primary-foreground shadow-button font-medium bg-teal-700 hover:bg-teal-600"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    提交中...
                  </>
                ) : (
                  "提交"
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}