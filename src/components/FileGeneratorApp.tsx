import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileImage, Loader2 } from "lucide-react";
import { toast } from "sonner";
interface GeneratedFile {
  id: string;
  name: string;
  url: string;
  thumbnail: string;
}
export default function FileGeneratorApp() {
  const [storeName, setStoreName] = useState("");
  const [selectedVersion, setSelectedVersion] = useState<"一般版" | "候位版" | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedFiles, setGeneratedFiles] = useState<GeneratedFile[]>([]);
  const handleVersionChange = (version: "一般版" | "候位版", checked: boolean) => {
    if (checked) {
      setSelectedVersion(version);
    } else if (selectedVersion === version) {
      setSelectedVersion(null);
    }
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
        version: selectedVersion
      };

      // API call to webhook
      const response = await fetch("https://grouper-brief-monthly.ngrok-free.app/webhook-test/callMeBack", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        throw new Error("生成失敗");
      }

      // Mock response for demonstration
      const mockFiles: GeneratedFile[] = [{
        id: "1",
        name: `${storeName}_QR碼_${selectedVersion}.png`,
        url: "/api/download/file1",
        thumbnail: "https://via.placeholder.com/200x200/00BFA5/ffffff?text=QR+1"
      }, {
        id: "2",
        name: `${storeName}_立牌_${selectedVersion}.png`,
        url: "/api/download/file2",
        thumbnail: "https://via.placeholder.com/200x300/00BFA5/ffffff?text=立牌"
      }, {
        id: "3",
        name: `${storeName}_海報_${selectedVersion}.pdf`,
        url: "/api/download/file3",
        thumbnail: "https://via.placeholder.com/200x280/00BFA5/ffffff?text=海報"
      }];
      setGeneratedFiles(mockFiles);
      toast.success("檔案生成成功！");
    } catch (error) {
      toast.error("生成過程中發生錯誤，請重試");
      console.error(error);
    } finally {
      setIsGenerating(false);
    }
  };
  const downloadFile = async (file: GeneratedFile) => {
    try {
      // 以 Blob 方式下載，避免內容型別/編碼錯誤導致「檔案格式錯誤」
      const res = await fetch(file.url, {
        method: "GET",
        mode: "cors"
      });
      if (!res.ok) throw new Error(`下載失敗: ${res.status}`);
      const blob = await res.blob();

      // 從 Content-Disposition 取檔名（若有），否則用預設名稱
      const dispo = res.headers.get("content-disposition") || "";
      const match = dispo.match(/filename\*?=(?:UTF-8'')?["']?([^\"';]+)["']?/i);
      const filename = match?.[1] ? decodeURIComponent(match[1]) : file.name;
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success(`開始下載 ${filename}`);
    } catch (err) {
      console.error(err);
      toast.error("下載失敗，請稍後再試");
    }
  };
  return <div className="min-h-screen bg-gradient-background p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold mb-2 text-emerald-600">
            叫叫我圖形檔案生成系統
          </h1>
          <p className="text-muted-foreground text-lg">
            輕鬆生成專業的店家圖形檔案
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Side - Input Section */}
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
                  <Input id="storeName" value={storeName} onChange={e => setStoreName(e.target.value)} placeholder="請輸入店家名稱" className="bg-input border-input-border focus:ring-ring" disabled={isGenerating} />
                </div>

                <div className="space-y-4">
                  <Label className="text-foreground font-medium">版本選擇</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="general" checked={selectedVersion === "一般版"} onCheckedChange={checked => handleVersionChange("一般版", checked as boolean)} disabled={isGenerating} />
                      <Label htmlFor="general" className="text-foreground cursor-pointer">
                        一般版
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox id="waiting" checked={selectedVersion === "候位版"} onCheckedChange={checked => handleVersionChange("候位版", checked as boolean)} disabled={isGenerating} />
                      <Label htmlFor="waiting" className="text-foreground cursor-pointer">
                        候位版
                      </Label>
                    </div>
                  </div>
                </div>

                <Button onClick={handleSubmit} disabled={!storeName.trim() || !selectedVersion || isGenerating} size="lg" className="w-full bg-gradient-primary text-primary-foreground shadow-button font-medium bg-teal-700 hover:bg-teal-600">
                  {isGenerating ? <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      生成中...
                    </> : "提交"}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Right Side - Files Section */}
          <div className="space-y-6">
            {/* Download Section */}
            <Card className="shadow-card border-border/50 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-emerald-600">
                  <Download className="mr-2 h-5 w-5" />
                  檔案下載
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedFiles.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                    <FileImage className="mx-auto h-12 w-12 mb-3 opacity-50" />
                    <p>尚未生成任何檔案</p>
                    <p className="text-sm">請填寫左側表單並提交</p>
                  </div> : <div className="space-y-3">
                    {generatedFiles.map(file => <div key={file.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg border border-border/30">
                        <div className="flex-1">
                          <p className="font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            可供下載
                          </p>
                        </div>
                        <Button onClick={() => downloadFile(file)} size="sm" className="bg-success hover:bg-success/90 text-success-foreground shadow-sm">
                          <Download className="h-4 w-4 mr-1" />
                          下載
                        </Button>
                      </div>)}
                  </div>}
              </CardContent>
            </Card>

            {/* Thumbnails Section */}
            <Card className="shadow-card border-border/50 bg-card/95 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center text-teal-600">
                  <FileImage className="mr-2 h-5 w-5" />
                  檔案縮圖
                </CardTitle>
              </CardHeader>
              <CardContent>
                {generatedFiles.length === 0 ? <div className="text-center py-8 text-muted-foreground">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[1, 2, 3].map(i => <div key={i} className="aspect-square bg-muted rounded-lg border-2 border-dashed border-border/50 flex items-center justify-center">
                          <FileImage className="h-8 w-8 opacity-30" />
                        </div>)}
                    </div>
                    <p className="text-sm text-teal-600">縮圖預覽區域</p>
                  </div> : <div className="grid grid-cols-3 gap-4">
                    {generatedFiles.map(file => <div key={file.id} className="group relative cursor-pointer" onClick={() => downloadFile(file)}>
                        <img src={file.thumbnail} alt={file.name} className="w-full aspect-square object-cover rounded-lg border border-border/30 group-hover:shadow-lg transition-all duration-300" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded-lg transition-all duration-300 flex items-center justify-center">
                          <Download className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 h-6 w-6" />
                        </div>
                        <p className="text-xs text-center mt-2 text-muted-foreground truncate">
                          {file.name}
                        </p>
                      </div>)}
                  </div>}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
}