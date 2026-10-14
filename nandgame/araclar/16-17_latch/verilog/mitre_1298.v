// CWE-1298 — MITRE'nin 1. örneği (kapılardan 2x1 seçici), her atamaya 1 birim gecikme eklenmiş hâli.
// MITRE'nin düzeltme satırı (assign z <= … or … and …) geçerli Verilog değil, iverilog sözdizimi hatası verir;
// burada geçerli yazımı kullanıldı. Beklenen çıktı: hatalı kodda sel 1→0 iken z bir tik 0'a düşer (01), düzeltilmişte düşmez.
// Çalıştır: iverilog -o tbm mitre_1298.v && vvp -n tbm

// MITRE CWE-1298 Örnek 1, her atamaya 1 birim gecikme eklenmiş hâli
module glitchEx(input wire in0, in1, sel, output wire z);
  wire not_sel, and_out1, and_out2;
  assign #1 not_sel = ~sel;
  assign #1 and_out1 = not_sel & in0;
  assign #1 and_out2 = sel & in1;
  assign #1 z = and_out1 | and_out2;                   // "Buggy line"
endmodule
module fixed(input wire in0, in1, sel, output wire z);
  wire not_sel, and_out1, and_out2;
  assign #1 not_sel = ~sel;
  assign #1 and_out1 = not_sel & in0;
  assign #1 and_out2 = sel & in1;
  assign #1 z = and_out1 | and_out2 | (in0 & in1);     // MITRE'nin düzeltmesinin geçerli yazımı
endmodule
module tb;
  reg in0, in1, sel; wire zb, zf;
  glitchEx B(in0,in1,sel,zb); fixed F(in0,in1,sel,zf);
  initial begin
    in0=1; in1=1; sel=1; #10;
    sel=0;
    repeat (6) begin #1 $write("%b%b ", zb, zf); end
    $display(" <- sel 1->0, in0=in1=1 (hatali, duzeltilmis)");
    $finish;
  end
endmodule
