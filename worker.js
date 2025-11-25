export default {
  async fetch(request) {
    const html = `
<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>NetSys Ops - 全方位維運知識庫</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/remixicon@3.5.0/fonts/remixicon.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&family=JetBrains+Mono:wght@400;700&display=swap" rel="stylesheet">

    <style>
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        .custom-code { tab-size: 4; }
    </style>
    
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        cisco: '#049fd9',
                        nxos: '#00bceb',
                        palo: '#fa582d',
                        forti: '#c32025',
                        hp: '#c32085',
                        linux: '#fcc624',
                        win: '#00a4ef',
                        dark: '#0f172a',
                        kb: '#8b5cf6',
                    }
                }
            }
        }
    </script>
</head>
<body>

<div id="app" class="flex h-screen overflow-hidden text-slate-800">

    <!-- 左側導航欄 -->
    <aside class="w-64 bg-slate-900 text-white flex flex-col flex-shrink-0 shadow-xl z-20">
        <div class="p-6 flex items-center gap-3 border-b border-slate-800">
            <i class="ri-server-line text-3xl text-indigo-400"></i>
            <div>
                <h1 class="font-bold text-lg tracking-wide">NetSys Ops</h1>
                <p class="text-xs text-slate-400">網路 & 系統維運中心</p>
            </div>
        </div>

        <nav class="flex-1 overflow-y-auto p-3 space-y-1">
            
            <div class="px-3 pt-4 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">網路設備</div>
            
            <button @click="setVendor('cisco')" :class="getNavClass('cisco', 'bg-cisco')" class="nav-btn">
                <i class="ri-router-line text-lg"></i> <span class="font-medium">Cisco IOS (傳統)</span>
            </button>
            
            <button @click="setVendor('nxos')" :class="getNavClass('nxos', 'bg-nxos')" class="nav-btn">
                <i class="ri-database-2-line text-lg"></i> <span class="font-medium">Cisco Nexus (N3K)</span>
            </button>

            <button @click="setVendor('palo')" :class="getNavClass('palo', 'bg-palo')" class="nav-btn">
                <i class="ri-fire-line text-lg"></i> <span class="font-medium">Palo Alto</span>
            </button>

            <button @click="setVendor('forti')" :class="getNavClass('forti', 'bg-forti')" class="nav-btn">
                <i class="ri-shield-check-line text-lg"></i> <span class="font-medium">Fortinet</span>
            </button>
            <button @click="setVendor('hp')" :class="getNavClass('hp', 'bg-hp')" class="nav-btn">
                <i class="ri-router-line text-lg"></i> <span class="font-medium">HP</span>
            </button>

            <div class="px-3 pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">作業系統</div>

            <button @click="setVendor('linux')" :class="getNavClass('linux', 'bg-yellow-600')" class="nav-btn">
                <i class="ri-ubuntu-line text-lg"></i> <span class="font-medium">Linux Server</span>
            </button>

            <button @click="setVendor('windows')" :class="getNavClass('windows', 'bg-win')" class="nav-btn">
                <i class="ri-windows-fill text-lg"></i> <span class="font-medium">Windows / PS</span>
            </button>

            <div class="px-3 pt-6 pb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">通用知識庫</div>

            <button @click="setVendor('kb')" :class="getNavClass('kb', 'bg-kb')" class="nav-btn">
                <i class="ri-book-read-line text-lg"></i> <span class="font-medium">網路基礎知識 (Wiki)</span>
            </button>

        </nav>

        <div class="p-4 border-t border-slate-800 text-center text-xs text-slate-500">
            Updated for 2025 Operations
        </div>
    </aside>

    <!-- 主要內容 -->
    <main class="flex-1 flex flex-col bg-gray-50 min-w-0">
        
        <!-- Header -->
        <header class="bg-white border-b px-8 py-4 flex justify-between items-center shadow-sm z-10">
            <div>
                <h2 class="text-2xl font-bold text-gray-800 flex items-center gap-3">
                    <span :class="vendorColorClass" class="w-3 h-8 rounded-full block shadow-md"></span>
                    {{ currentVendorName }}
                </h2>
                <p class="text-sm text-gray-500 mt-1 ml-6">
                    已收錄 {{ filteredDocs.length }} 條技術指令
                </p>
            </div>
            
            <div class="relative w-96">
                <i class="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                <input type="text" v-model="searchQuery" placeholder="搜尋指令 (例如: vpc, tar, netstat)..." 
                    class="w-full pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm">
            </div>
        </header>

        <!-- Categories -->
        <div class="px-8 pt-6 pb-2 flex gap-2 overflow-x-auto no-scrollbar">
            <button @click="currentCategory = 'all'" 
                :class="currentCategory === 'all' ? 'bg-slate-800 text-white' : 'bg-white text-gray-600 hover:bg-gray-100'"
                class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors shadow-sm whitespace-nowrap">
                全部
            </button>
            <button v-for="cat in categories" :key="cat" @click="currentCategory = cat"
                :class="currentCategory === cat ? 'bg-indigo-100 text-indigo-700 border-indigo-200' : 'bg-white text-gray-600 hover:bg-gray-100'"
                class="px-4 py-1.5 rounded-full text-sm font-medium border transition-colors shadow-sm whitespace-nowrap">
                {{ cat }}
            </button>
        </div>

        <!-- Content Grid -->
        <div class="flex-1 overflow-y-auto p-8 scroll-smooth">
            <transition-group name="fade" tag="div" class="grid grid-cols-1 xl:grid-cols-2 gap-6 pb-20">
                
                <div v-for="(doc, index) in filteredDocs" :key="index" 
                    class="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-200 flex flex-col group">
                    
                    <div class="flex justify-between items-start mb-3">
                        <div>
                            <span class="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-100 text-gray-600 mb-2 border border-gray-200">
                                {{ doc.category }}
                            </span>
                            <h3 class="text-lg font-bold text-gray-800 tracking-tight">{{ doc.title }}</h3>
                        </div>
                        <div class="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full text-xl text-gray-400">
                            <i :class="getIcon(doc.category)"></i>
                        </div>
                    </div>

                    <p class="text-gray-600 text-sm mb-4 leading-relaxed border-l-2 border-gray-200 pl-3">
                        {{ doc.desc }}
                    </p>

                    <div class="mt-auto relative">
                        <button @click="copyCode(doc.code)" class="absolute right-2 top-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded border border-white/20 transition opacity-0 group-hover:opacity-100">
                            <i class="ri-file-copy-line mr-1"></i>複製
                        </button>
                        <pre class="bg-[#1e293b] text-gray-200 p-4 rounded-lg text-sm font-mono overflow-x-auto leading-normal shadow-inner"><code>{{ doc.code }}</code></pre>
                    </div>
                </div>

            </transition-group>

            <div v-if="filteredDocs.length === 0" class="flex flex-col items-center justify-center py-20 text-gray-400">
                <i class="ri-ghost-line text-6xl mb-4"></i>
                <span class="text-lg">這裡空空如也...</span>
            </div>
        </div>
    </main>
</div>

<script>
    const { createApp } = Vue

    createApp({
        data() {
            return {
                currentVendor: 'nxos', 
                currentCategory: 'all',
                searchQuery: '',
                database: {
                    // ================= CISCO IOS (Traditional) =================
                    cisco: [
                        { title: 'VLAN 與 Access Port', category: 'Switching', desc: '建立 VLAN 並指派介面。', code: 'conf t\\nvlan 10\\n name USER_PC\\nexit\\ninterface Gi1/0/1\\n switchport mode access\\n switchport access vlan 10\\n spanning-tree portfast\\nend' },
                        { title: 'Trunk (802.1Q) 設定', category: 'Switching', desc: '設定 Uplink Port 為 Trunk 模式。', code: 'interface Gi1/0/24\\n switchport trunk encapsulation dot1q\\n switchport mode trunk\\n switchport trunk allowed vlan 10,20,99\\nend' },
                        { title: 'OSPF 路由設定', category: 'Routing', desc: '啟用 OSPF 並宣告網段。', code: 'router ospf 1\\n router-id 1.1.1.1\\n network 192.168.10.0 0.0.0.255 area 0\\n passive-interface default\\n no passive-interface Gi0/1' },
                        { title: 'DHCP Server', category: 'Services', desc: '配置內建 DHCP 服務。', code: 'ip dhcp pool LAN_10\\n network 192.168.10.0 255.255.255.0\\n default-router 192.168.10.254\\n dns-server 8.8.8.8\\n lease 7' },
                        { title: 'Show 指令大全', category: 'Troubleshooting', desc: '最常用的查修指令。', code: 'show ip int brief\\nshow cdp neighbors detail\\nshow ip route\\nshow interfaces status\\nshow log' },
                        { title: '儲存設定 (Save Config)', category: 'Basic', desc: '將 Running Config 寫入 Startup Config (永久保存)。', code: 'write memory\\n# 或者\\ncopy running-config startup-config' },
                        { title: '排程重開機 (Reload Schedule)', category: 'Management', desc: '設定設備在特定時間後重開機 (遠端維護怕斷線必備)。', code: '# 10分鐘後重開\\nreload in 10\\n# 取消重開\\nreload cancel' },
                        { title: '設定時區與時間 (Clock)', category: 'Basic', desc: '設定台北時區 (GMT+8)。', code: 'clock timezone TW 8\\n# 手動設定時間\\nclock set 12:00:00 22 Nov 2025' },
                        { title: '防止 DNS 查詢 (No IP Domain-Lookup)', category: 'Basic', desc: '防止打錯指令時設備卡住去查 DNS。', code: 'conf t\\nno ip domain-lookup\\nline console 0\\n logging synchronous\\nend' },
                        { title: '加密明文密碼', category: 'Security', desc: '將設定檔中的明文密碼加密顯示 (Type 7)。', code: 'service password-encryption' },
                        { title: '設定 Banner 警語', category: 'Basic', desc: '設定登入前的警告訊息。', code: 'banner motd #\\nAuthorized Access Only!\\n#' },
                        { title: '建立本地使用者 (User)', category: 'Management', desc: '建立最高權限 (Privilege 15) 的本地帳號。', code: 'username admin privilege 15 secret MyP@ssw0rd' },
                        { title: '備份還原機制 (Archive)', category: 'Management', desc: '設定自動備份，並啟用設定回滾功能 (Rollback)。', code: 'archive\\n path flash:archive\\n write-memory\\n time-period 1440\\nend' },
                        { title: '批量介面設定 (Range)', category: 'Basic', desc: '一次設定多個 Port。', code: 'interface range Gi1/0/1 - 24\\n description USER_PORTS\\n no shutdown' },
                        { title: 'Loopback 介面', category: 'Routing', desc: '建立邏輯介面，常用於 OSPF Router-ID 或管理 IP。', code: 'interface loopback 0\\n ip address 10.0.0.1 255.255.255.255' },
                        { title: 'Sub-Interface (Router on a Stick)', category: 'Routing', desc: '單臂路由：在一個實體 Port 上切分多個 VLAN Gateway。', code: 'interface Gi0/0.10\\n encapsulation dot1q 10\\n ip address 192.168.10.254 255.255.255.0\\ninterface Gi0/0.20\\n encapsulation dot1q 20\\n ip address 192.168.20.254 255.255.255.0' },
                        { title: '清除介面計數器', category: 'Troubleshooting', desc: '歸零介面的 Error/Traffic 統計，方便觀察新的錯誤。', code: 'clear counters interface Gi1/0/1' },
                        { title: 'VLAN 建立與命名', category: 'Switching', desc: '標準 VLAN 建立步驟。', code: 'vlan 10\\n name SALES\\nvlan 20\\n name HR' },
                        { title: 'STP PortFast (快速轉發)', category: 'Switching', desc: '讓接電腦的 Port 跳過 STP 偵測，立即連線。', code: 'interface Gi1/0/1\\n spanning-tree portfast' },
                        { title: 'STP BPDU Guard (防護)', category: 'Switching', desc: '若 Access Port 收到 Switch 的 BPDU 封包則自動關閉 Port。', code: 'interface Gi1/0/1\\n spanning-tree bpduguard enable' },
                        { title: 'EtherChannel (LACP)', category: 'Switching', desc: '將多條線路綑綁為一條 (LACP 模式)。', code: 'interface range Gi1/0/1 - 2\\n channel-group 1 mode active\\ninterface port-channel 1\\n switchport mode trunk' },
                        { title: 'Port Security (MAC 綁定)', category: 'Security', desc: '限制該 Port 只能學習 1 個 MAC，違規就 Shutdown。', code: 'interface Gi1/0/1\\n switchport port-security\\n switchport port-security maximum 1\\n switchport port-security violation shutdown\\n switchport port-security mac-address sticky' },
                        { title: 'DHCP Snooping', category: 'Security', desc: '防止內網私接 IP 分享器發放錯誤 IP。', code: 'ip dhcp snooping\\nip dhcp snooping vlan 10\\n# 上連 Port 設為信任\\ninterface Gi1/0/24\\n ip dhcp snooping trust' },
                        { title: 'SSH 啟用設定', category: 'Security', desc: '產生 RSA Key 並啟用 SSH 第 2 版。', code: 'ip domain-name cisco.com\\ncrypto key generate rsa modulus 2048\\nip ssh version 2\\nline vty 0 4\\n transport input ssh' },
                        { title: 'NAT Overload (PAT)', category: 'Services', desc: '讓內網多人共用一個 WAN IP 上網 (最常用)。', code: 'access-list 1 permit 192.168.10.0 0.0.0.255\\nip nat inside source list 1 interface Gi0/0 overload\\ninterface Gi0/0\\n ip nat outside\\ninterface Gi0/1\\n ip nat inside' },
                    ],

                    // ================= CISCO NX-OS (N3K/N9K) =================
                    nxos: [
                        { title: '啟用 L2 基礎功能', category: 'Basic', desc: 'NX-OS 預設功能全關，需手動開啟 (LACP, VLAN, STP)。', code: 'conf t\\nfeature lacp\\nfeature interface-vlan\\nfeature vtp\\nfeature udld\\nfeature lldp' },
                        { title: '啟用 L3 路由功能', category: 'Basic', desc: '開啟 OSPF, BGP, PBR 等路由功能。', code: 'feature ospf\\nfeature bgp\\nfeature pbr\\nfeature bfd' },
                        { title: '啟用資料中心功能 (vPC/VXLAN)', category: 'Basic', desc: '開啟 vPC 與 VXLAN 相關功能。', code: 'feature vpc\\nfeature nv overlay\\nfeature vn-segment-vlan-based\\nnv overlay evpn' },
                        { title: '設定 Hostname', category: 'Basic', desc: '設定設備名稱。', code: 'hostname N3K-LEAF-01' },
                        { title: '啟用 SSH 服務', category: 'Security', desc: '產生 RSA Key 並啟用 SSH。', code: 'feature ssh\\ncrypto key generate rsa modulus 2048\\nline vty\\n transport input ssh' },
                        { title: 'vPC Domain 建立', category: 'vPC', desc: '建立 vPC 網域 (兩台 Switch ID 需一致)。', code: 'vpc domain 10\\n role priority 10\\n system-priority 4096\\n peer-keepalive destination 10.1.1.2 source 10.1.1.1 vrf management' },
                        { title: 'vPC Peer-Link 設定', category: 'vPC', desc: '設定兩台 Switch 之間的資料同步鏈路。', code: 'interface port-channel 1\\n description vPC-PEER-LINK\\n switchport mode trunk\\n switchport trunk allowed vlan 1-3967\\n vpc peer-link\\n spanning-tree port type network' },
                        { title: 'vPC Member Port (接入端)', category: 'vPC', desc: '連接 Server 或 Downlink Switch 的 LACP 設定。', code: 'interface Ethernet1/10\\n channel-group 10 mode active\\ninterface port-channel 10\\n vpc 10\\n switchport mode trunk' },
                        { title: 'Show vPC 狀態 (簡易)', category: 'vPC', desc: '檢查 vPC 是否成功建立。', code: 'show vpc brief' },
                        { title: '建立 VLAN', category: 'Switching', desc: '建立並命名 VLAN。', code: 'vlan 10\\n name WEB_SVR\\n state active' },
                        { title: 'Trunk Port 設定', category: 'Switching', desc: '設定 Trunk 並只允許特定 VLAN。', code: 'interface Ethernet1/2\\n switchport mode trunk\\n switchport trunk allowed vlan 10,20' },
                        { title: '建立 VRF (虛擬路由)', category: 'Routing', desc: '建立 Tenant VRF 以隔離路由表。', code: 'vrf context TENANT_A\\n rd 65001:10\\n address-family ipv4 unicast' },
                        { title: 'HSRP 設定 (Anycast Gateway)', category: 'Routing', desc: '設定 NX-OS 的 HSRP (vPC 環境建議用 Anycast Gateway)。', code: 'interface vlan 10\\n hsrp 10\\n  ip 192.168.10.1\\n  priority 110\\n  preempt' },
                        { title: 'VXLAN NVE 設定 (VTEP)', category: 'VXLAN', desc: '建立 VXLAN Tunnel Endpoint 介面。', code: 'interface nve1\\n no shutdown\\n source-interface loopback0\\n host-reachability protocol bgp\\n member vni 10000 mcast-group 239.1.1.1' },
                        { title: 'BGP EVPN 設定', category: 'VXLAN', desc: '設定 EVPN Address Family 交換 MAC/IP。', code: 'router bgp 65001\\n neighbor 192.168.0.2\\n  address-family l2vpn evpn\\n   send-community extended' },
                        { title: 'IP ACL (存取控制列表)', category: 'Security', desc: '建立 L3 ACL。', code: 'ip access-list BLOCK_WEB\\n deny tcp any any eq 80\\n permit ip any any' },
                        { title: 'Checkpoint (設定快照)', category: 'Management', desc: '修改設定前先建立快照，做錯可還原。', code: 'checkpoint before_change\\n# 還原指令:\\nrollback running-config checkpoint before_change' },
                        { title: 'Ethanalyzer (內建 Wireshark)', category: 'Troubleshooting', desc: 'NX-OS 最強大的抓包工具。', code: 'ethanalyzer local interface inband capture-filter "icmp" limit-captured-frames 10' },
                        { title: 'Show Tech-Support', category: 'Troubleshooting', desc: '產生完整技術支援報告 (給 TAC 用)。', code: 'show tech-support > bootflash:tech.log' },
                        { title: 'vPC 完整建置範例 (SOP)', category: 'vPC', desc: '包含 Primary/Secondary 兩台設備的完整配置流程。', code: '! === Switch-1 (Primary) ===\\nvpc domain 100\\n role priority 10\\n peer-keepalive destination 192.168.1.2 source 192.168.1.1 vrf management\\n peer-gateway\\n auto-recovery\\n ip arp synchronize\\n\\n! === Switch-2 (Secondary) ===\\nvpc domain 100\\n role priority 20\\n peer-keepalive destination 192.168.1.1 source 192.168.1.2 vrf management\\n' },
                    ],

                    // ================= LINUX (Server) =================
                    linux: [
                        { title: '檔案權限管理', category: 'File System', desc: 'chmod 與 chown 常用範例。', code: '# 遞迴修改擁有者\\nchown -R www-data:www-data /var/www/html\\n# 修改權限 (755: Dir, 644: File)\\nfind . -type d -exec chmod 755 {} \\\\;\\nfind . -type f -exec chmod 644 {} \\\\;' },
                        { title: '網路狀態檢查', category: 'Network', desc: '取代 ifconfig 與 netstat 的新指令。', code: '# 顯示 IP\\nip a\\n# 顯示路由\\nip r\\n# 顯示監聽中的 Port\\nss -tulpn\\n# 測試連線\\ncurl -v telnet://1.2.3.4:80' },
                        { title: '系統資源監控', category: 'Monitoring', desc: 'CPU, Memory, Disk 使用量查詢。', code: '# 互動式進程檢視\\nhtop\\n# 記憶體使用量\\nfree -h\\n# 硬碟空間\\ndf -h\\n# 查詢資料夾大小\\ndu -sh /var/log/*' },
                        { title: '服務管理 (Systemd)', category: 'System', desc: '管理背景服務狀態。', code: 'systemctl status nginx\\nsystemctl restart nginx\\nsystemctl enable nginx  # 開機自啟\\njournalctl -u nginx -f  # 即時查看 Log' },
                        { title: '壓縮與解壓縮', category: 'File Ops', desc: '常用的 tar 指令。', code: '# 壓縮\\ntar -czvf backup.tar.gz /home/user\\n# 解壓縮\\ntar -xzvf backup.tar.gz -C /tmp' },
                        { title: '搜尋檔案與內容', category: 'File Ops', desc: 'find 與 grep 組合技。', code: '# 找檔名\\nfind /etc -name "*.conf"\\n# 找檔案內容\\ngrep -rn "error" /var/log/syslog' },
                        { title: '複製檔案/目錄', category: 'File', desc: '複製檔案或整個資料夾 (-r 遞迴複製)。', code: 'cp file.txt /tmp/\\ncp -r folder_a folder_b' },
                        { title: '即時監控 Log', category: 'View', desc: '即時顯示檔案新增的內容 (除錯必備)。', code: 'tail -f /var/log/nginx/access.log' },
                        { title: '查看 Port 佔用', category: 'Network', desc: '查看哪些程式佔用了網路 Port。', code: 'netstat -tulpn\\nss -tulnp' },
                        { title: '遠端複製 (SCP)', category: 'Network', desc: '透過 SSH 傳輸檔案。', code: 'scp localfile.txt user@remote:/tmp/\\nscp user@remote:/var/log/syslog .' },
                        { title: '字串取代 (Sed)', category: 'Text', desc: '將檔案中的字串 A 取代為 B。', code: 'sed "s/error/ERROR/g" log.txt' },
                        { title: '強大文本分析 (Awk)', category: 'Text', desc: '列印特定欄位 (例如印出 Process 的 PID)。', code: 'ps aux | awk \\'{print $2}\\'' },
                    ],

                    // ================= WINDOWS (CMD/PowerShell) =================
                    windows: [
                        { title: '網路配置查詢 (IP)', category: 'Network', desc: '查看詳細 IP、MAC 與 DNS 資訊。', code: ':: CMD\\nipconfig /all\\n\\n# PowerShell\\nGet-NetIPAddress | Format-Table' },
                        { title: '測試 Port 連通性', category: 'Network', desc: 'PowerShell 版的 Telnet，非常實用。', code: '# PowerShell (取代 Telnet)\\nTest-NetConnection -ComputerName 8.8.8.8 -Port 53\\n\\n# 簡寫\\ntnc 192.168.1.1 -p 443' },
                        { title: '路由追蹤 (Traceroute)', category: 'Troubleshooting', desc: '路徑追蹤指令。', code: ':: CMD\\ntracert -d 8.8.8.8\\n\\n# PowerShell\\nTest-NetConnection 8.8.8.8 -TraceRoute' },
                        { title: '查看系統資訊', category: 'System', desc: '查看開機時間、OS 版本、修補程式。', code: ':: CMD\\nsysteminfo | findstr /C:"OS"\\n\\n# PowerShell\\nGet-ComputerInfo' },
                        { title: '檔案複製 (Robocopy)', category: 'File Ops', desc: '微軟最強大的檔案複製工具 (含權限/鏡像)。', code: ':: 鏡像備份 (來源 -> 目的)\\nrobocopy C:\\\\Source D:\\\\Backup /MIR /MT:32 /R:3 /W:5 /LOG:backup.log' },
                    ],

                    // ================= PALO ALTO =================
                    palo: [
                        { title: 'CLI 設定 Management IP', category: 'Basic', desc: '出廠預設或無 GUI 時使用。', code: 'configure\\nset deviceconfig system ip-address 192.168.1.99 netmask 255.255.255.0 default-gateway 192.168.1.254\\ncommit' },
                        { title: '檢查 Session 表', category: 'Monitoring', desc: '查看目前連線狀態。', code: 'show session info\\nshow session id [ID]\\nshow session all filter source 10.1.1.1' },
                        { title: 'CLI 搜尋 Log', category: 'Troubleshooting', desc: '在終端機快速過濾 Traffic Log。', code: 'show log traffic direction equal backward limit 10\\nshow log system severity equal critical' },
                        { title: '查修封包丟棄原因 (Global Counters)', category: 'Troubleshooting', desc: 'PA 最強大的指令，查看底層 Drop 原因。', code: '# 1. 設定過濾器\\ndebug dataplane packet-diag set filter match source 192.168.1.10 destination 8.8.8.8\\n# 2. 啟用\\ndebug dataplane packet-diag set filter on\\n# 3. 查看計數器\\nshow counter global filter packet-filter yes delta yes' },
                        { title: '檢查光纖模組訊號 (Transceiver)', category: 'Hardware', desc: '查看 SFP 光模組的發光強度 (TX/RX Power)。', code: 'show system state filter-pretty sys.s1.p*.phy' },
                        { title: 'GlobalProtect 線上使用者', category: 'VPN', desc: '查看目前 VPN 使用者連線與 IP。', code: 'show global-protect-gateway current-user\\n\\n# 踢除使用者\\nrequest global-protect-gateway-client-logout user <username> gateway <gateway-name> reason force-logout' },
                        { title: '手動觸發動態更新 (App/Threat)', category: 'Management', desc: '手動下載並安裝最新的特徵碼。', code: 'request content upgrade download latest\\nrequest content upgrade install version latest' },
                        { title: '清除 ARP 快取', category: 'Network', desc: '清除特定介面或 IP 的 ARP 紀錄。', code: 'clear arp all\\nclear arp interface ethernet1/1 ip 10.1.1.254' },
                        { title: '查看系統資源使用率', category: 'System', desc: '查看 Management Plane 與 Data Plane 的 CPU/記憶體。', code: 'show system resources' },
                        { title: '查看硬碟空間', category: 'System', desc: '檢查硬碟使用量，避免 Log 塞滿。', code: 'show system disk-space' },
                        { title: '重啟系統 (Restart)', category: 'System', desc: '重新啟動防火牆。', code: 'request restart system' },
                        { title: '踢除管理員', category: 'System', desc: '強制登出管理員連線。', code: 'delete admin-sessions username <admin_name>' },
                        { title: '切換 CLI 顯示格式', category: 'Config', desc: '將顯示格式改為 set 模式，方便複製。', code: 'set cli config-output-format set' },
                        { title: '提交設定 (Commit)', category: 'Config', desc: '將設定生效。', code: 'commit' },
                        { title: '強制提交 (Force Commit)', category: 'Config', desc: '當 Commit 失敗時強制編譯。', code: 'commit force' },
                        { title: '比對設定差異', category: 'Config', desc: '比較 Running Config 與 Candidate Config。', code: 'show config diff' },
                        { title: '路由查閱 (Route Lookup)', category: 'Network', desc: '查詢防火牆將特定 IP 送往哪個介面。', code: 'test routing fib-lookup ip <目標IP> virtual-router default' },
                        { title: 'Ping 測試 (帶來源)', category: 'Network', desc: '指定來源介面進行 Ping。', code: 'ping source <介面IP> host <目標IP>' },
                        { title: '測試安全策略 (Policy Match)', category: 'Troubleshooting', desc: '模擬流量測試命中的 Security Policy。', code: 'test security-policy-match source <Src_IP> destination <Dst_IP> protocol 6 destination-port 80' },
                        { title: '測試 NAT 策略', category: 'Troubleshooting', desc: '測試流量命中的 NAT 規則。', code: 'test nat-policy-match source <Src_IP> destination <Dst_IP> protocol 6 destination-port 80' },
                        { title: '查看 IPsec (Phase 2) 狀態', category: 'VPN', desc: '查看 IPsec Tunnel 狀態。', code: 'show vpn ipsec-sa' },
                        { title: '查看 User-ID 狀態', category: 'User-ID', desc: '檢查與 AD Agent 的連線狀態。', code: 'show user user-id-agent state all' },
                        { title: '查看 HA 狀態', category: 'HA', desc: '查看 HA 角色與同步狀態。', code: 'show high-availability state' },
                        { title: '暫停 HA (強制切換)', category: 'HA', desc: '將本機 Suspend，強制切換。', code: 'request high-availability state suspend' },
                        { title: 'Dataplane 封包除錯 (Flow Basic)', category: 'Troubleshooting', desc: '啟用 Flow Trace 記錄封包處理過程。', code: 'debug dataplane packet-diag set filter match source <Src> destination <Dst>\\ndebug dataplane packet-diag set filter on\\ndebug dataplane packet-diag set log feature flow basic\\ndebug dataplane packet-diag set log on' },
                    ],

                    // ================= FORTINET =================
                    forti: [
                        { title: 'Debug Flow (除錯神器)', category: 'Troubleshooting', desc: 'Fortinet 必備：追蹤封包流向。', code: 'diagnose debug reset\\ndiagnose debug flow filter saddr 1.1.1.1\\ndiagnose debug flow trace start 10\\ndiagnose debug enable' },
                        { title: 'CLI 修改介面 IP', category: 'Basic', desc: '設定 WAN/LAN IP。', code: 'config system interface\\n edit "wan1"\\n  set mode static\\n  set ip 192.168.100.1 255.255.255.0\\n  set allowaccess ping https ssh\\n next\\nend' },
                        { title: '查看系統負載', category: 'Monitoring', desc: '類似 Linux top 指令。', code: 'get system performance status\\ndiagnose sys top 1' },
                        { title: 'VXLAN 設定 (L2 Bridge)', category: 'Switching', desc: '透過軟體交換器實現跨地區同網段延伸。', code: 'config system vxlan\\n edit "vxlan_to_hq"\\n  set interface "wan1"\\n  set vni 100\\n  set remote-ip 2.2.2.2\\n next\\nend' },
                        { title: '開啟策略全流量紀錄', category: 'Security', desc: '強制紀錄所有 Session (包含 Accept)。', code: 'config firewall policy\\n edit <ID>\\n  set logtraffic all\\n next\\nend' },
                        { title: '內建抓包工具 (Sniffer)', category: 'Troubleshooting', desc: '在 CLI 抓取封包內容。', code: 'diagnose sniffer packet any "host 8.8.8.8" 4 0 a' },
                        { title: 'IPsec VPN 除錯 (IKE)', category: 'VPN', desc: '查看 IKE 協商過程。', code: 'diagnose vpn ike log-filter dst-addr4 1.2.3.4\\ndiagnose debug application ike -1\\ndiagnose debug enable' },
                        { title: '查詢並清除 Session', category: 'Monitoring', desc: '清除卡住的連線。', code: 'diagnose sys session filter dst 8.8.8.8\\ndiagnose sys session list\\ndiagnose sys session clear' },
                        { title: '查看完整路由表', category: 'Network', desc: '查看實際生效路由 (FIB)。', code: 'get router info routing-table all' },
                        { title: 'HA 狀態檢查與切換', category: 'System', desc: '檢查 HA 或強制切換 Master。', code: 'get system ha status\\ndiagnose sys ha reset-uptime' },
                        { title: '檢查光纖訊號 (SFP)', category: 'Hardware', desc: '查詢光衰值。', code: 'get system interface transceiver' },
                        { title: '查看當機紀錄 (Crash Log)', category: 'Troubleshooting', desc: '檢查是否為 Bug 或記憶體不足造成。', code: 'diagnose debug crashlog read' },
                        { title: '查詢特定 IP 路由走向', category: 'Network', desc: '確認路由下一跳。', code: 'get router info routing-table details <目標IP>' },
                        { title: '備份設定檔 (TFTP)', category: 'Maintenance', desc: '備份設定到 TFTP Server。', code: 'execute backup config tftp <檔名> <IP>' },
                    ],

                    // ================= HP =================
                    hp: [
                        { title: "顯示軟體版本", category: "System", desc: "查看交換機版本資訊。", code: "show version" },
                        { title: "顯示運行配置", category: "System", desc: "顯示當前生效配置。", code: "show running-config" },
                        { title: "保存配置", category: "Configuration", desc: "保存配置到 Flash。", code: "write memory" },
                        { title: "進入接口配置", category: "Interface", desc: "進入端口配置模式。", code: "interface <port_list>" },
                        { title: "配置 VLAN IP", category: "VLAN", desc: "配置 SVI IP。", code: "vlan <id>\\nip address <ip> <mask>" },
                        { title: "設置 Tagged/Untagged", category: "VLAN", desc: "配置 Trunk 與 Access。", code: "vlan <id>\\ntagged <port>\\nuntagged <port>" },
                        { title: "LACP 鏈路聚合", category: "Link Aggregation", desc: "建立 LACP Trunk。", code: "trunk <ports> trk<id> lacp" },
                        { title: "啟用 SSH", category: "Security", desc: "啟用 SSH 服務。", code: "ip ssh\\ncrypto key generate rsa" },
                        { title: "顯示路由表", category: "Routing", desc: "查看路由表。", code: "show ip route" },
                        { title: "配置端口鏡像", category: "Monitoring", desc: "SPAN Port 設定。", code: "mirror port <src> monitor <dst>" },
                    ],

                    // ================= KNOWLEDGE BASE =================
                    kb: [
                        { title: 'OSI 七層模型', category: 'Theory', desc: '網路通訊標準模型。', code: 'L7 Application (HTTP)\\nL4 Transport (TCP/UDP)\\nL3 Network (IP)\\nL2 Data Link (MAC)\\nL1 Physical' },
                        { title: 'TCP 三向交握', category: 'Theory', desc: '建立連線過程。', code: 'SYN -> SYN-ACK -> ACK' },
                        { title: '常用 Port 速查', category: 'Reference', desc: '常見服務 Port。', code: '22 SSH, 23 Telnet, 53 DNS, 80 HTTP, 443 HTTPS, 3389 RDP' },
                        { title: 'CIDR 子網掩碼表', category: 'Reference', desc: 'IP 數量速查。', code: '/32 (1 IP), /30 (2 IPs), /29 (6 IPs), /28 (14 IPs), /24 (254 IPs)' },
                        { title: 'HTTP 狀態碼', category: 'Protocol', desc: 'Web 除錯狀態碼。', code: '200 OK, 301 Moved, 403 Forbidden, 404 Not Found, 500 Server Error' },
                    ]
                }
            }
        },
        computed: {
            currentVendorName() {
                const names = { 
                    cisco: 'Cisco IOS (Traditional)', 
                    nxos: 'Cisco Nexus (NX-OS)', 
                    palo: 'Palo Alto Networks', 
                    forti: 'Fortinet',
                    hp: 'HP',
                    linux: 'Linux Server',
                    windows: 'Microsoft Windows',
                    kb: '網路基礎知識庫 (Wiki)' 
                };
                return names[this.currentVendor];
            },
            vendorColorClass() {
                const colors = { 
                    cisco: 'bg-cisco', nxos: 'bg-nxos', palo: 'bg-palo', forti: 'bg-forti',
                    hp: 'bg-hp', linux: 'bg-linux', windows: 'bg-win', kb: 'bg-kb' 
                };
                return colors[this.currentVendor] || 'bg-gray-500';
            },
            categories() {
                const docs = this.database[this.currentVendor] || [];
                return Array.from(new Set(docs.map(d => d.category))).sort();
            },
            filteredDocs() {
                let docs = this.database[this.currentVendor] || [];
                if (this.currentCategory !== 'all') {
                    docs = docs.filter(d => d.category === this.currentCategory);
                }
                if (this.searchQuery) {
                    const q = this.searchQuery.toLowerCase();
                    docs = docs.filter(d => 
                        d.title.toLowerCase().includes(q) || 
                        d.code.toLowerCase().includes(q) ||
                        d.desc.toLowerCase().includes(q)
                    );
                }
                return docs;
            }
        },
        methods: {
            setVendor(vendor) {
                this.currentVendor = vendor;
                this.currentCategory = 'all';
                this.searchQuery = '';
            },
            getNavClass(vendor, activeBg) {
                const base = "w-full flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 group text-sm mb-1 ";
                if (this.currentVendor === vendor) {
                    return base + activeBg + " text-white shadow-md";
                }
                return base + "text-slate-400 hover:bg-slate-800 hover:text-white";
            },
            getIcon(category) {
                const map = {
                    'Routing': 'ri-route-line',
                    'Switching': 'ri-git-merge-line',
                    'vPC': 'ri-links-line',
                    'Security': 'ri-shield-keyhole-line',
                    'Troubleshooting': 'ri-bug-2-line',
                    'Basic': 'ri-terminal-box-line',
                    'Management': 'ri-admin-line',
                    'Network': 'ri-global-line',
                    'System': 'ri-cpu-line',
                    'File System': 'ri-folder-lock-line',
                    'File Ops': 'ri-file-copy-2-line',
                    'Monitoring': 'ri-pulse-line',
                    'AD/User': 'ri-user-settings-line'
                };
                return map[category] || 'ri-code-s-slash-line';
            },
            async copyCode(text) {
                try {
                    await navigator.clipboard.writeText(text);
                    alert('指令已複製！');
                } catch (err) { console.error(err); }
            }
        }
    }).mount('#app')
</script>

</body>
</html>
    `;

    return new Response(html, {
      headers: {
        "content-type": "text/html;charset=UTF-8",
      },
    });
  },
};