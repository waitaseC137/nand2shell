// 17 · D Latch — oyundaki kara kutu select neden geçti, açılmış hâli neden kaldı?
// Sınanan çıkarım: oyun kutuyu tek adımda, içeride gecikme olmadan hesaplıyor gibi.
// Tek adımda karar veren kutu biti tutar; kapılardan kurulu hâli titrer (tik tik iz: 11 11 10 11 10 …).
// Çalıştır: iverilog -o tbk kutu_vs_kapi.v && vvp -n tbk

// Kara kutu select: karar TEK adımda, aynı st değeriyle (içeride ayrı gecikme yok)
module kutu(input st, input d, output reg out);
  always @(st or d or out) out <= #1 (st ? d : out);
endmodule
// Açılmış select: her kapının kendi gecikmesi var (NandGame'in parçalarına açtığı yapı)
module kapilar(input st, input d, output out);
  wire nst, a1, a2;
  not #1 i0(nst, st); and #1 g1(a1, st, d); and #1 g2(a2, nst, out); or #1 g3(out, a1, a2);
endmodule
module tb;
  reg st, d; wire o_kutu, o_kapi;
  kutu K(st, d, o_kutu); kapilar P(st, d, o_kapi);
  initial begin
    st=1; d=1; #20 $display("st=1 d=1           : kutu=%b  kapilar=%b", o_kutu, o_kapi);
    st=0;
    repeat (10) begin #1 $write("%b%b ", o_kutu, o_kapi); end
    $display(" <- st=0'dan sonra tik tik (kutu,kapilar)");
    #20 $display("st=0, sonra        : kutu=%b  kapilar=%b   (beklenen 1)", o_kutu, o_kapi);
    $finish;
  end
endmodule
