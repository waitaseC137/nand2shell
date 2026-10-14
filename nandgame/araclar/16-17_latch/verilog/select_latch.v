// 17 · D Latch "Neden Select Değil?" ve CWE-1298 — select'li latch, farklı kapı gecikmeleriyle.
// Sınanan: aynı devre gecikmeye göre üç sonuç verir. st=1 d=1 yazıp st=0 yapınca:
//   kapılar eşit hızda → titrer (ekrandaki son değer o anın fotoğrafı; tik tik izde 0101… görünür)
//   inv yavaş → biti kaybeder (oyunda tuvalde görülen)  ·  inv hızlı → sorunsuz  ·  Earle terimiyle → sorunsuz
// Çalıştır: iverilog -o tbs select_latch.v && vvp -n tbs

// NandGame'de parçalarına açılan select'in yapısı: out = or( and(st,d), and(inv(st), out) )
// Gecikmeler parametre: INV = inv gecikmesi, G = and/or gecikmesi
module sel_latch #(parameter INV=1, G=1) (input st, input d, output out);
  wire nst, a1, a2;
  not #INV i0(nst, st);
  and #G   g1(a1, st, d);
  and #G   g2(a2, nst, out);
  or  #G   g3(out, a1, a2);
endmodule
// Earle düzeltmesi: üçüncü terim and(d, out) eklenir
module earle #(parameter INV=1, G=1) (input st, input d, output out);
  wire nst, a1, a2, a3;
  not #INV i0(nst, st);
  and #G   g1(a1, st, d);
  and #G   g2(a2, nst, out);
  and #G   g4(a3, d, out);
  or  #G   g3(out, a1, a2, a3);
endmodule
module tb;
  reg st, d;
  wire o_esit, o_yavas_inv, o_hizli_inv, o_earle;
  sel_latch #(1,1) A(st,d,o_esit);        // bütün kapılar aynı hızda
  sel_latch #(3,1) B(st,d,o_yavas_inv);   // inv yavaş
  sel_latch #(1,3) C(st,d,o_hizli_inv);   // inv hızlı, and/or yavaş
  earle     #(3,1) D(st,d,o_earle);       // inv yavaş ama Earle terimi var
  initial begin
    st=1; d=1; #30;
    $display("st=1 d=1 yazildi        : esit=%b  yavas_inv=%b  hizli_inv=%b  earle=%b", o_esit,o_yavas_inv,o_hizli_inv,o_earle);
    st=0; #40;
    $display("st=0 (d=1 kaldi), sonra : esit=%b  yavas_inv=%b  hizli_inv=%b  earle=%b   (beklenen hepsi 1)", o_esit,o_yavas_inv,o_hizli_inv,o_earle);
    $finish;
  end
  initial begin
    #30; repeat (14) begin #1 $write("%b", o_esit); end $display("  <- esit gecikmede st indikten sonraki tik tik cikis");
  end
endmodule
